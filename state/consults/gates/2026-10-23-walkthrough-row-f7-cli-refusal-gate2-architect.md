Reviewed: PR #244 at abc900f2b4706669bc4abbc35024b28a451a5e86, gate 2 (scoped), architect, main 443cefba, #241 at 2fc01f59
Verdict: FAIL

The verdict rests only on the words of one sentence: OPEN-4's parenthetical in Part F's deviation paragraph. The PR changes no code. The other added rows pass. Under §31, I give replacement words below. The words are the architect's and the human approved them (the ruling's item 2), so I name the finding for the human rather than replace it. The human can answer yes (applied with no re-gate, and recorded in the PR body), give their own words (checked once), or accept it as it stands (the gap is recorded in the source comment and on the form).

Where I read things: the branch file in the worktree `C:/dev/wt/f7`, at the head abc900f2 (from the worktree's HEAD ref and the branch ref). I compared the old text against main 443cefba's copy of `frontends/shell/MANUAL-WALKTHROUGH.md`, not B's tree. B's tree and the diff are the reviewer's to check by script. #241 was read in `C:/dev/wt/rds`, whose branch ref is 2fc01f5955a0dc21d51ee4cdffc3e5c55800959d. I have no Bash, so I computed no hashes and ran no scripts.

## Correctness

**C1 (wording, §31): OPEN-4's parenthetical, "the shell's publish refuses without that record", describes a refusal the operator does not reach on the Windows dev tree.**
- At #241's head, `frontends/shell/src-tauri/tauri.conf.json`'s `bundle.resources` maps both `renderer/bundle-viewer/dist/*` and `renderer/bundle-viewer/viewer-asset-hashes.json`.
- The shell's `build.rs` calls `tauri_build::build()`. The shell's `Cargo.lock` at #241 pins tauri-build 2.6.3 and tauri-utils 2.9.3. I read their crate sources in the local cargo registry:
  - `copy_resources` in tauri-build's `src/lib.rs` copies every resource into the target directory on each build script run. It propagates the iterator's error (`let resource = resource?;`).
  - In tauri-utils' `src/resources.rs`, a missing path gives `Error::ResourcePathNotFound` and a glob that matches nothing gives `Error::GlobPathNotFound`.
  - The build script reruns when the config changes: `cargo:rerun-if-changed` is emitted for the config file and for each resource.
- So after #241 merges, a dev tree without the record fails at `npm run tauri dev`'s cargo build, before any window opens. The operator never reaches Part G's publish.
- The remedy the sentence gives is right. Only the stated reason is wrong. Ordinary use reaches it: it is the A4 case itself, a viewer built before #241.
- The condition and the remedy check true at #241:
  - `scan-dist.mjs` deletes the old record and writes `viewer-asset-hashes.json` in `renderer/bundle-viewer` only after a passing scan;
  - the viewer's `package.json` `build` script is `node build.mjs && node scripts/scan-dist.mjs`.

**Replacement words.** The clause after `(from `C:\dev\spatial-ide`); ` becomes the text below, rewrapped greedily at 100 columns. That keeps it at 3 lines, so §7 still counts 3+2 for OPEN-4 and 13 in all. The `cargo build` sentence is unchanged.

if `renderer/bundle-viewer/dist`, or the `viewer-asset-hashes.json` beside it, does not exist, run `npm run build` from `renderer/bundle-viewer` first (the shell's build stops when either is missing).

**Clause check** (at #241's head, with the crates named above):
- **"`viewer-asset-hashes.json` beside it":** `scan-dist.mjs`'s `main` writes `join(root, 'viewer-asset-hashes.json')`, where `root` is `renderer/bundle-viewer`, the parent of `dist`.
- **"run `npm run build` from `renderer/bundle-viewer`":** that writes `dist/` through `build.mjs`, then the record through `scan-dist.mjs` after a passing scan.
- **"the shell's build stops when either is missing":**
  - both paths are `bundle.resources` entries;
  - `copy_resources` returns the first resource error;
  - a missing `dist/` matches no file under the `dist/*` glob (`GlobPathNotFound`);
  - a missing record is `ResourcePathNotFound`;
  - `npm run tauri dev` builds the shell through cargo, which runs `build.rs`.
- **Named, not blocking:** a scan that finds an unreviewed match also writes no record. Ordinary use does not reach that at #241's head, because CI's scan passes.

These words also fix D1, so one yes from the human closes both.

## Evidence

None. §4 items 1 to 3 at abc900f2 are the reviewer's to run by script. The worker's report and Amendment 4 item 1 state them.

## Documentation (must fix before the merge)

**D1: the uncarried code spans** (check 2). The form's option (b) words for OPEN-4 were written as one code span, so their inner code spans could not be marked. Applying them byte for byte left `renderer/bundle-viewer/dist`, `npm run build` and `renderer/bundle-viewer` as plain text. `viewer-asset-hashes.json` is plain too. Everywhere else, the walkthrough backticks paths and commands.
- **Class:** Documentation. It is formatting, not truth.
- **Who decides:** the words are human-approved, so this is named for the human. C1's replacement words carry all four spans.
- **A fourth case, in Amendment 4 item 2's same class but not named there:** G7's new parenthetical writes serve-bundle.mjs as plain text, while the same row backticks the command. If the human wants it marked, the parenthetical becomes: (on a fresh port, so it does not collide with any other `serve-bundle.mjs` session still running). This is optional, and also the human's call.

**D2: the record.** The form's §0 (A4) and OPEN-4's "What happens" say a pre-#241 dev tree is refused at Part G's publish with W8. Per C1, it is refused earlier, at the shell's build. The amendment that records the human's answer to C1 should name this finding by reference. No edit above it.

## Out of scope, for the custodian to route to #241 (not a finding on #244)

- In tauri-utils 2.9.3, `resource_dir_from` returns the executable's directory on Windows unconditionally. So under `tauri dev` on Windows, `app.path().resource_dir()` is `Ok(target/debug)`.
- The build has also copied `dist/*` to `target/debug/bundle-viewer/` and the record to `target/debug/`. So `resolve_viewer_dir` picks that copy first, and `read_build_record` runs with `packaged = true`.
- Two comments are therefore untrue on Windows:
  - `bundled_viewer`'s doc comment, that a plain `tauri dev` run resolves nothing under a resource directory;
  - `commands.rs`'s comment at both `bundled_viewer` calls, that `resource_dir()` fails under `tauri dev`.
- W8's dev remedy is not reached on the Windows dev tree, and a W8 there would carry the packaged remedy.

## What I checked

**1. Each added row against its option's clause check:**
- **F8** (whole row): byte-equal to OPEN-1 (b)'s words. Its clauses are true:
  - F7 runs nothing;
  - F6 (line 273 at the head) is the reset;
  - G1 (line 325) holds the **Export interactive map…** button.
  - The e2e table's F8 row (line 304) stays true.
- **Intro line 259:** only the span changed. The new span equals OPEN-1 (b)'s words. G1 to G5 publish and G7 serves the bundle into the separate viewer. Lines 256 to 258 and 260 to 261, including the quoted note 8, read unchanged against main.
- **G7** (line 331 at the head; line 330 on main, moved by the deviation paragraph's added line): both spans equal OPEN-2 (b)'s words, and the rest of the row reads unchanged against main.
  - `serve-bundle.mjs` on main takes the port as its third argument and prints the URL the row names.
  - The new F7 (line 274) points at G7.
- **OPEN-4's clause:** byte-equal to the form's words, as 3 lines. Its condition and remedy hold at #241 (`scan-dist.mjs`; the viewer's `package.json`). `bundled_viewer` reads the record in the resolved viewer directory's parent and refuses when it is missing, and the dev-remedy text is the one shown above. The parenthetical fails as worded (C1).

**2. The three uncarried spans:** a finding, class Documentation (D1), named for the human.

**3. §8 items 1 to 5 against the added rows:**
- **Item 1:** the changed spans are only the four that OPEN-1, OPEN-2 and OPEN-4 name, by my reading against main. Whole-file equality is the reviewer's §4 item 3.
- **Item 2:** one file (Amendment 4 item 1; the worker's `--name-only`). Nothing under `kernel/`, `renderer/`, `scripts/plan/` or `protocol/`.
- **Item 3:** the new text has no quotation marks. G7's existing quoted status line reads unchanged against main.
- **Item 4:** no class, offset or count is claimed. OPEN-4's clause shares §2.3's window (the form's OPEN-4), and no row calls the skip, the record or R2 proven. C1 is the one clause that claims more than the code shows.
- **Item 5:** no bare `path:line` and no pin in any added row.
