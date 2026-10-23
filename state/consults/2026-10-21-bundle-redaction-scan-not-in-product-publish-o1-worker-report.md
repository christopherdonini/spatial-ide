*Custodian's filing note (2026-10-21): the redaction scan's O1 at B′ c7d02156, before any code (the form's Amendment 3, item 8), by a worker-high: as predicted. Under item 8 a pass is recorded in the PR body with B′, not as an amendment. The run 2026-10-21T22:06:29Z to 22:09:04Z by its transcript (Read 8, Bash 9, Grep 1, Write 1, Edit 2). Its claims were read against that transcript's calls before filing. Extracted by script from its SubagentHandback call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 815fc2287c1e78937f9a0821face4ed2cf6753993585b2369a65dabb16f845cb.*

---

O1: bundle-redaction-scan-not-in-product-publish at B′ c7d02156d042c25f14d84c841ac89268ea5cec78, worker-high
Result: as predicted

Every command below ran in the foreground with a timeout and its output redirected to a file in `<scratch>/o1`, which is my scratch folder (its path contains a user-profile name, so I don't write it out). The exit code was printed right after each command. None of the commands was heavy by the machine paragraph's measure, so no hold was taken.

**Steps**
1. Worktree state:
   - `git status --porcelain` printed nothing (rc 0).
   - `git rev-parse HEAD` printed f88255437e64e8ba34e78e6c8273678f85718acf.
   - `git merge-base origin/main HEAD` printed c7d02156d042c25f14d84c841ac89268ea5cec78.
   - The branch is `cut/bundle-redaction-scan`.
2. Driver compile:
   - Command: `rustc --edition 2021 scan_driver.rs -o scan_driver.exe`, run in `<scratch>/o1` with `timeout 120`. rc 0.
   - `redaction.rs` compiles on its own. The only diagnostic is a dead-code warning for `MachineIdentifiers::from_environment`, which is unused here.
3. Unchanged build:
   - `npm ci` (timeout 400): rc 0. It added 31 packages and reported 0 vulnerabilities, with an npm warning that esbuild's postinstall script is not covered by allowScripts. The build still ran.
   - `npm run build` (timeout 300): rc 0.
   - Driver over `dist/` (timeout 120): rc 0.
4. Strip build:
   - I made the scratch edit to `build.mjs`.
   - `npm run build`: rc 0.
   - Driver over `dist/`: rc 0.
   - Restore: `git checkout -- renderer/bundle-viewer/build.mjs`, rc 0.
5. The esbuild versions and the comment check are below.
6. Clean-up checks are below.

**Driver source** (`<scratch>/o1/scan_driver.rs`, whole):
```rust
#[path = "C:/dev/wt/rds/kernel/src/bundle/redaction.rs"]
mod redaction;

fn main() {
    let dir = match std::env::args().nth(1) {
        Some(d) => std::path::PathBuf::from(d),
        None => {
            eprintln!("usage: scan_driver <directory>");
            std::process::exit(2);
        }
    };
    let machine = redaction::MachineIdentifiers::default();
    match redaction::scan_directory(&dir, &machine) {
        Ok(findings) => {
            for f in &findings {
                println!("{} {} {}", f.file, f.class, f.byte_offset);
            }
        }
        Err(e) => {
            eprintln!("walk failed: {}", e.kind());
            std::process::exit(1);
        }
    }
}
```
Compile command: `rustc --edition 2021 scan_driver.rs -o scan_driver.exe`.

**`dist/` inventory, unchanged build** (3 files; path, bytes, sha256):
- `NOTICE.txt`, 163998, 826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb
- `app.js`, 447637, 4f4e86c977cb8877fc9c8dbceb6e29b92cc338916c24e7564154c3cb75d0176d
- `index.html`, 6463, 622604f482af8c4551ca406c42fee9298b429d8e2213460effee38ff4d3aa58c

**`dist/` inventory, strip build** (3 files):
- `NOTICE.txt`, 163998, 826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb
- `app.js`, 333011, 778198dd07180c597db8a444721b192c679b4ef37a0f5d4652f41c52ee899af8
- `index.html`, 6463, 622604f482af8c4551ca406c42fee9298b429d8e2213460effee38ff4d3aa58c

`NOTICE.txt`'s sha256 is equal in the two builds. `cmp` between the saved copy of the first and the second `dist/NOTICE.txt` also returned rc 0.

**Findings** (file, class, byte offset)
- Unchanged build, exactly three:
  - `NOTICE.txt`, `credential`, 19092
  - `NOTICE.txt`, `local-filesystem-path`, 111337
  - `app.js`, `local-filesystem-path`, 7291
- Strip build, exactly two:
  - `NOTICE.txt`, `credential`, 19092
  - `NOTICE.txt`, `local-filesystem-path`, 111337

**Step 4's diff** (`git diff -- build.mjs`):
```diff
--- a/renderer/bundle-viewer/build.mjs
+++ b/renderer/bundle-viewer/build.mjs
@@ -36,6 +36,8 @@ const result = await build({
   // `notice()` (in `./notice.mjs`) derives the notice file from what was *actually* bundled, not
   // from a list.
   metafile: true,
+  minifyWhitespace: true,
+  legalComments: 'eof',
 });
```
`minifyIdentifiers` and `minifySyntax` are not set. After `git checkout -- renderer/bundle-viewer/build.mjs` (rc 0), `git status --porcelain` printed nothing.

**esbuild versions**
- `renderer/bundle-viewer/package-lock.json` pins 0.28.2 under `node_modules/esbuild`, at lock line 633 to 634.
- `node_modules/esbuild/package.json` says 0.28.2.
- `import('esbuild').version` says 0.28.2.

**Comment check**
- The comment is at `renderer/bundle-viewer/src/manifest.ts` lines 321 to 322. I searched for its first sentence, "Any URI scheme, not just a drive letter".
- Command: `grep -c -F 'Any URI scheme, not just a drive letter' <file>`.
- Source `src/manifest.ts`: count 1.
- Unchanged build's `dist/app.js`: **present** (count 1, rc 0).
- Strip build's `dist/app.js`: **absent** (count 0, rc 1).

**Cleanliness**
- `git status --porcelain`: empty (rc 0).
- `git status --porcelain --ignored` lists only `renderer/bundle-viewer/dist-metafile.json`, `renderer/bundle-viewer/dist/` and `renderer/bundle-viewer/node_modules/`.
- HEAD and B′ are unchanged, as in step 1.
- The driver, its output files and both builds' copies of `app.js` and `NOTICE.txt` remain in `<scratch>/o1`.
- The final `dist/` holds the strip build. It is ignored, and I did not rebuild.

**Processes**
- No `rustc`, `scan_driver`, `npm` or `esbuild` process is running (a CIM query counted 0).
- One `node.exe` (PID 42056) is running. It was created at 22:59 on 21 Oct, before I started, so it is not mine and I left it alone.

**Tool versions:** node v24.18.1, npm 11.16.0, rustc 1.97.1 (8bab26f4f 2026-07-14).
