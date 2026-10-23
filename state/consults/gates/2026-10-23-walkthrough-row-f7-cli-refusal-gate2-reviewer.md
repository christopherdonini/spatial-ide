Reviewed: PR #244 at abc900f2b4706669bc4abbc35024b28a451a5e86, gate 2 (scoped), reviewer, main 443cefba
Verdict: FAIL

cut/walkthrough-row-f7-cli-refusal @ abc900f2b4706669bc4abbc35024b28a451a5e86. #241 was read at 2fc01f5955a0dc21d51ee4cdffc3e5c55800959d (A). B is fd47e6cf101b7105a9257ced914351ff06032e90.

The fail rests on one wording finding (C1). The diff itself is clean: every new text matches its option (b) byte for byte, and §4 items 1 to 3, §7, both verify tools and CI all pass. Under §31, the fix is the replacement words below, with no re-gate.

## Correctness

**C1. OPEN-4's parenthetical states a consequence that ordinary use does not show. It blocks on wording only.**

The words at the head are the architect's, and the human approved them (directive item 2: "the architect's words in each"). So this finding goes to the human under §31, who answers yes, gives their own words, or accepts it as it stands.

- **The span at the head (byte-copied):** `(the shell's publish refuses without that record)`
- **What happens at A on Windows, the reference platform:**
  - `frontends/shell/src-tauri/tauri.conf.json` maps `../../../renderer/bundle-viewer/viewer-asset-hashes.json` into `bundle.resources`. `build.rs` is `tauri_build::build()`.
  - The shell's lockfile pins tauri-build 2.6.3 and tauri-utils 2.9.3.
  - tauri-build 2.6.3 copies every mapped resource into the profile directory on every build, dev included (`src/lib.rs` `copy_resources` at 88, called at 570 and 572, with no dev condition).
  - A missing path that is not a glob returns `ResourcePathNotFound` (tauri-utils 2.9.3 `src/resources.rs:190`, reached at 278). `build()` then exits 1 (`src/lib.rs:453-463`).
  - So without the record, `npm run tauri dev` stops in the shell's build script. That is Part A's A1, before Part F. #241's own CI says the viewer build is "a precondition of the shell's own build" (`.github/workflows/product-ci-shell.yml` at A, the step before `npm ci`).
  - Once the shell has built, its publish reads the build-time copy, not the file in `renderer/bundle-viewer`. On Windows, tauri-utils 2.9.3 `resource_dir` returns the executable's directory (`src/platform.rs:297-302`). `commands.rs` passes it to `bundled_viewer`, `resolve_viewer_dir` picks `<exe dir>/bundle-viewer` (the copy), and `read_build_record` reads the record in its parent, which is also the copy.
  - So "the shell's publish refuses without that record" is never what the operator sees. In ordinary use, a dev tree whose viewer was built before #241 (the A4 case) fails to build the shell. If the record goes missing after a build, the publish still succeeds from the copy.
- **Replacement words (the clause after `first (from \`C:\dev\spatial-ide\`); `):**
  `if renderer/bundle-viewer/dist, or the viewer-asset-hashes.json beside it, does not exist, run npm run build from renderer/bundle-viewer first (the shell's build copies that record for its publish, and stops without it).`
  - Only the parenthetical changes. The greedy 100-column wrap stays three lines (89, 97, 83 columns). Only the third physical line differs from the head, so §7 stays 13.
- **Clause check of the replacement, against code at A:**
  - "the shell's build copies that record": the `bundle.resources` map, plus `copy_resources` on every build.
  - "for its publish": on Windows, `resource_dir` is the exe directory, and `bundled_viewer` → `read_build_record` reads `viewer-asset-hashes.json` in that directory.
  - "and stops without it": `ResourcePathNotFound`, then `build()` exits 1.
  - The rest of the sentence is unchanged and stays true. `npm run build` runs `node build.mjs && node scripts/scan-dist.mjs` (`renderer/bundle-viewer/package.json` at A), and `scan-dist.mjs` writes the record beside `dist/` only after a passing scan (`main`, lines 74-103 at A).
- **Named, not blocking (for the sentence's source comment):** the record can be removed after the shell was built, by hand or by a later viewer rebuild whose scan fails (which deletes the old record first). The running shell then still publishes from its build-time copy until its next build. Ordinary walkthrough use does not reach this.

## Evidence

None. Each check below exited 0 and matched the form.

## Documentation (must-fix before the merge, no re-gate)

**D1. OPEN-4's paths carry no code spans.** Amendment 4 item 2 discloses this. The words are the human-approved ones, so this is named for the human rather than replaced.
- If the human wants code spans, the variant is the C1 words with `renderer/bundle-viewer/dist`, `viewer-asset-hashes.json`, `npm run build` and `renderer/bundle-viewer` backticked.
- It wraps to four lines (91, 78, 95, 12 columns), which makes OPEN-4 4+2 = 6 and the total 14. That is exactly §7's ceiling, not over it.

## Outside this scope, for the custodian (not findings of this gate)

1. **The form's A4 and OPEN-4 premise does not hold at A on Windows.** They say the case is "refused at Part G's publish with W8, whose remedy names that command" and that `bundled_viewer`'s dev remedy names `npm run build`. Per C1, the shell's build fails first. Even if `read_build_record` were reached, `packaged` is `resource_dir.is_some()`, which is always true on Windows, so the text would be the packaged remedy ("reinstall Spatial IDE"). The form is append-only, so a correcting amendment is the custodian's call.
2. **For #241's own gates:** `frontends/shell/src-tauri/src/publish.rs` at A says "a plain `tauri dev` run never supplies one" (`resolve_viewer_dir`'s comment), and `commands.rs` at A says the same of `resource_dir()` under `tauri dev`. tauri-utils 2.9.3 `platform.rs:297-302` contradicts both on Windows. The dev-remedy branches of `resolve_viewer_dir` and `read_build_record` look unreachable on Windows.
3. **The filed worker report miscounts hunks.** It says "exactly five hunks" but lists four (`git diff -U0` gives 4). It is a filed record, so this is noted only.

## What I checked (command, exit code)

- **Inputs:**
  - Read the form on main 443cefba (OPEN items, Amendments 1 to 4), the directive's item 2, the worker's report, and the PR body. `gh pr view 244` rc=0: head abc900f2, draft true.
  - Worktree states: `git rev-parse HEAD` rc=0 (abc900f2 in `C:/dev/wt/f7`, 2fc01f59 in `C:/dev/wt/rds`); `git status --porcelain` rc=0 and empty in both.
- **Check 1:**
  - `git diff 8fbd04cc..abc900f2` rc=0: one file, four hunks.
  - Script `f7-g2r-check1.mjs` compared the diff with the form's option (b) words.
    - First run rc=1: my script's backslash literal was collapsed by the shell. That was my defect, not the PR's.
    - Fixed, rerun rc=0.
  - Results:
    - Each option (b) text (F8, the line-259 span, the G7 parenthetical, the G7 contrast clause, OPEN-4) is extracted from the form on main.
    - Each old text occurs once at 8fbd04cc and zero times at H. Each new text occurs zero times at 8fbd04cc and once at H; OPEN-4's is checked through its wrap.
    - Rebuilding H from 8fbd04cc by these replacements gives exactly H's bytes, 323959 = 323959, so no other byte changed.
    - The greedy 100-column wrap of the kept prefix, the words and the full stop gives H's three lines (89, 97, 56 columns).
    - The intro line is 98 columns.
- **Check 2 (§4 items 1 to 3, script `f7-g2r-check2.mjs`, rc=0):**
  - Item 1: `git diff -U0 B...H` has 4 hunks (-259, -274,2, -279,2, -330). Every old line is in the allowance {259, 274, 275, 279, 280, 330}.
  - Item 2:
    - `publish-bundle.exe --data`: 1 at B (positive), 0 at H.
    - `viewer/NOTICE.txt`: 0 at B and 1 at H, in the F7 line. Self-tested positive at B by `git grep -c` (5 hits in `kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md`).
    - `kernel/src/bin/publish-bundle.rs`: in H's F7 line. Self-tested positive at B by `git grep -c`, rc=0.
    - The `cargo build -p spatial-kernel --bin` sentence is byte-identical at B and H.
  - Item 3: every line outside the allowance is identical between B and H (1963 = 1963).
- **Check 3 (§7):**
  - `git diff --numstat fd47e6cf...abc900f2 -- frontends/shell/MANUAL-WALKTHROUGH.md` rc=0: 7 added, 6 removed = 13, within 14.
  - Each part is within its own ceiling: F7 2/2, OPEN-1 4/4, OPEN-2 2/2, OPEN-4 5/6. No overrun, no class 8.
  - `git diff --name-only` over the same range, rc=0: only `frontends/shell/MANUAL-WALKTHROUGH.md`. The merge-base is B (rc=0), and the range holds two commits, 8fbd04cc and abc900f2 (rc=0).
- **Check 4:**
  - `node scripts/plan/verify-cites.mjs` at H: rc=0, PASS across 2202 files, 130 loose advisories. The one walkthrough advisory is the existing line 891, not an added row. Tool commit at H: a382c50813c316feb0525adf54da40607ce16d66.
  - `node scripts/plan/verify-quotes.mjs` at H: rc=0, PASS, 99 verified, 0 hash-reference errors. Tool commit at H: c3e70acb4914a4533764f312cdf0a25eb300e436.
  - `gh pr checks 244` rc=0: all 8 checks pass. `gh run list` rc=0: every run behind them has headSha abc900f2b4706669bc4abbc35024b28a451a5e86 (runs 39866553472, 39866553471, 39866553464, 39866553411, 39866547294, 39866547213), all completed/success.
- **C1's facts, read-only:**
  - `git show 2fc01f59:` of `frontends/shell/src-tauri/{tauri.conf.json,build.rs,src/publish.rs,src/commands.rs,Cargo.lock}`, `renderer/bundle-viewer/{package.json,scripts/scan-dist.mjs}` and `.github/workflows/product-ci-shell.yml`, each rc=0. `git grep viewer-asset-hashes` at A rc=0.
  - tauri-build 2.6.3 and tauri-utils 2.9.3 sources read from the local cargo registry by `sed` and `grep`, each rc=0.
  - `node f7-g2r-wrap.mjs` rc=0 for the replacement wraps.

No heavy command was run, so no machine hold was taken. Scratch files are all named `f7-g2r-*`. Nothing outside the scratch folder was written.
