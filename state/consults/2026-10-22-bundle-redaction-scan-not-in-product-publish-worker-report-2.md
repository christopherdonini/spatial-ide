*Custodian's filing note (2026-10-22): PR #241's correction round 1 by a worker-high, at 95edf33b on 6a10ee24 (the form's Amendment 6 item 3). The run 2026-10-22T01:38:53Z to 02:09:45Z by its transcript (Read 6, Grep 1, Bash 48, Edit 2, Write 1); its claims were read against that transcript's calls before filing. It discloses one helper script written to the home folder by mistake and moved to the scratch folder before any other action. No test asserts C3's new per-file bound; that is for the scoped re-gate. Extracted by script from its SubagentHandback call, with its one scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 65b19c292bfe5e3c7ba5b7f7f05280c45c68526ef73c24698341b23378a08e3d.*

---

Corrected: PR #241 round 1 at 95edf33be3640fd68dbed77f6d5055e6189506a1

Branch cut/bundle-redaction-scan in C:/dev/wt/rds, on top of 6a10ee24. The commit is signed off and carries both trailer lines. Its subject is the one the brief gave, and the body names both gate reports.

**Corrections (7 files, +52/-22 at the commit; paths relative to C:/dev/wt/rds)**
- **C1, hash form:**
  - `kernel/src/publish/viewer_assets.rs`: `is_built_asset` now compares `canonical::sha256_hex(bytes).strip_prefix("sha256:") == Some(hash.as_str())`. Its doc comment says "bare hex sha256". U1 builds its record from the bare hex and gains the assert "an entry in the sha256: form", which uses a `prefixed` value and `!is_built_asset`.
  - `kernel/tests/permission_boundary.rs`: T6 writes its record as 64 lowercase hex.
  - `frontends/shell/src-tauri/src/publish.rs`: T8 writes the record as `{"version":1,"assets":{"NOTICE.txt":"<hex>"}}` plus `\n`, with a one-line comment saying it matches `scan-dist.mjs`.
- **C2, test-only arguments:**
  - `renderer/bundle-viewer/scripts/scan-dist.mjs`: `main()` takes no parameters and is not exported. The final line is `process.exit(main());`. The usage comment no longer shows `[dist-dir [record-file]]`. `compare` and `listFiles` stay exported.
  - `renderer/bundle-viewer/scripts/scan-dist.test.mjs`: `runOnCopy` builds the scratch mirror and runs the unchanged script from it. `scan-dist.mjs` and `scan-dist.rs` go under `<tmp>/renderer/bundle-viewer/scripts/`. `redaction-reviewed.json` and `dist/` go under `<tmp>/renderer/bundle-viewer/`. `kernel/src/bundle/redaction.rs` goes under `<tmp>/kernel/src/bundle/`. It also adds `mkdirSync` to the imports.
- **C3, findings held:** `kernel/src/bundle/redaction.rs`, `walk`. Each file is scanned into its own `found`. With `first_only` it returns `found` only when `found` holds a finding outside `operator-declared`, and otherwise drops it. Without `first_only` it does `findings.extend(found)`. I also reworded `walk`'s doc comment (the `first_only` sentence said "what it found up to there"). The §2.4 byte-identical regions were not touched; only the walk region and that comment changed.
- **D-2:** `renderer/bundle-viewer/scripts/scan-dist.rs` line 5 is now the reviewer's line, byte for byte, as a single-line replacement.

**Push:** `git push origin cut/bundle-redaction-scan` ran alone: 6a10ee24..95edf33b, exit code 0. A later fetch showed origin at 95edf33b.

**Re-observations at 95edf33b.** Each mutation was applied by a script (`rds-c1-mut.mjs` in the scratch folder), the named test was run alone with `--exact`, and the file was reverted with `git checkout -- <file>` (rc 0). `git status --porcelain` was empty after each revert.
- **Passing, unmutated:** the commit's full kernel and shell suites show U1 (`only_a_viewer_file_whose_bytes_hash_to_its_own_build_record_entry_is_skipped`), T6 (`a_viewer_asset_matching_its_build_record_is_published_and_the_same_asset_one_byte_changed_is_refused`) and T8 (`bundled_viewer_reads_the_build_record_beside_the_viewer_directory_and_refuses_without_it`) as `ok`. U1 includes its new assert. I also ran U1 and T6 together and T8 alone before the commit, on the identical tree. Both passed.
- **M8** (`is_built_asset` ignores the hash):
  - U1 failed, rc 101, at the "one byte changed" assert (viewer_assets.rs:352).
  - T6 failed, rc 101, at permission_boundary.rs:1214.
- **M9** (the skip ignores the path and accepts any record value): U1 failed, rc 101, at "another path, the same bytes" (viewer_assets.rs:355).
- **M10** (the gate never skips, at the `mod.rs` call site):
  - T6 failed, rc 101, at permission_boundary.rs:1199, on its first half ("a viewer file matching its build record is not scanned again"). The error was `RedactionFinding` at `viewer/NOTICE.txt`, class `credential`, byte 22.
  - T8 failed, rc 101, at publish.rs:3284 with `got Refused { ... viewer/NOTICE.txt ... credential at byte 22 ... }`.
- **M12** (`compare` ignores the offset): `node --test scripts/scan-dist.test.mjs` exited 1. The second V1 test, "a reviewed row passes only at its own file, class and offset", failed at "offset + 1". The first V1 test passed.
- **M13** (the record is written before comparing): the same command exited 1. The first V1 test failed at "no record is written for a failed scan". The second V1 test passed.

**Suites at 95edf33b** (all in the worktree):

| Command | Exit | Result |
|---|---|---|
| `cargo test -p spatial-kernel` (shared hold) | 0 | 383 passed, 0 failed, 40 ignored, over 45 result lines |
| `cargo test` in `frontends/shell/src-tauri` (shared hold) | 0 | 73 passed (71 + 2), 0 failed |
| `cargo fmt --all --check` | 0 | |
| `cargo fmt --check` in src-tauri | 0 | |
| `rustfmt --edition 2021 --check renderer/bundle-viewer/scripts/scan-dist.rs` | 0 | |
| `npm run verify` in `renderer/bundle-viewer` | 0 | 104 tests, 104 pass, 0 fail |
| `verify-cites.mjs` | 0 | PASS, 2178 files |
| `verify-quotes.mjs` | 0 | PASS, 0 hash-reference errors |
| `verify-test-claims.mjs` | 0 | PASS, 613 claimed tests |

**Build:** `npm run build` exited 0. Its scan lines were:
- `scan-dist: 3 files scanned, 2 findings, all reviewed; record written`
- `reviewed row NOTICE.txt credential 19092: matched`
- `reviewed row NOTICE.txt local-filesystem-path 111337: matched`
- `reviewed row app.js local-filesystem-path 7291: not found`

The written record has the keys `version` and `assets`, ends with a newline, and all three values (`NOTICE.txt`, `app.js`, `index.html`) are 64 lowercase hex. `dist/NOTICE.txt` is 826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb, the same as at B′.

**§7:** `git diff --numstat c7d02156d042c25f14d84c841ac89268ea5cec78...HEAD` exited 0. It shows 24 files, 866 insertions + 22 deletions = 888, against 1,222. Each row is changed lines against item 10's ceiling:

| File | Changed | Ceiling |
|---|---|---|
| product-ci-viewer.yml | 10 | 30 |
| .gitignore | 1 | 2 |
| KNOWN-LIMITATIONS.md | 9 | 22 |
| engine/README.md | 2 | 4 |
| engine/src/fixture.rs | 45 | 50 |
| shell publish.rs | 159 | 240 |
| tauri.conf.json | 1 | 2 |
| kernel/README.md | 12 | 12 |
| publish-bundle.rs | 13 | 16 |
| redaction.rs | 62 | 66 |
| reader.rs | 26 | 30 |
| boundary.rs | 3 | 8 |
| error.rs | 21 | 30 |
| publish/mod.rs | 42 | 42 |
| viewer_assets.rs | 71 | 110 |
| permission_boundary.rs | 124 | 150 |
| typed_terminal_codes.rs | 34 | 35 |
| build.mjs | 6 | 16 |
| package.json | 2 | 2 |
| redaction-reviewed.json | 8 | 12 |
| scan-dist.mjs | 107 | 130 |
| scan-dist.rs | 32 | 60 |
| scan-dist.test.mjs | 91 | 150 |
| manifest.ts | 7 | 3 |

- `manifest.ts` is over, but it is the overrun Amendment 4 already records as class 8. This round did not touch it.
- `redaction.rs` has no `mod tests` change, so its 62 counts against 66.
- `viewer_assets.rs` has 31 changed lines outside `mod tests`, against 50. The shell `publish.rs` changes outside its test modules are unchanged this round, at 42 against 45.
- `mod.rs` (42) and `kernel/README.md` (12) are untouched this round.
- No file went over beyond the recorded `manifest.ts`.

**Differences from the reports or the brief**
- My first pre-commit kernel hold run used two test filters, which cargo refuses (rc 1). It never reached a test. I re-ran it with the single filter `build_record`.
- The brief's "U1, T6 and T8" for M8 to M10 follows Amendment 3 item 8. I ran only the tests it names per mutation: M8 with U1 and T6, M9 with U1, M10 with T6 and T8. I did not run T8 under M8 or M9.
- The T8 comment I added is one line.
- I did not add a mutation for C3. The brief asked for none, and no existing test asserts the new per-file bound.
- I wrote one helper script to the home folder by mistake and moved it to the scratch folder before any other action.
- The scratch-folder listing from my first `ls` was large. It shows files from other sessions, which I did not touch.

**Final state:** `git status --porcelain` is empty; HEAD and origin/cut/bundle-redaction-scan are both 95edf33b.

**Holds:** nine shared holds under project SpatialIDE (two pre-commit, five mutation runs, two suites). Each was granted (`MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF ...`) and released (`MACHINE_RELEASED project=SpatialIDE ... affinity=FF (cores 0-7)`). A count of the log files shows one grant line and one release line in each. The first failed pre-commit attempt's own lines were overwritten by its re-run, but it also ended with a release call. No exit code in 96 to 99 occurred.

**Processes:** every command I ran was foreground and has exited; no cargo, rustc, scan-dist or test process of mine remains. One unrelated `node.exe` is running that I did not start. I left it alone.

**Model:** Sonnet 5.5, model ID claude-sonnet-5-5.

Scratch files, all under `<the session scratch folder>/`, are named `rds-c1-*`.
- Commit message: `rds-c1-msg.txt`.
- Edit scripts: `rds-c1-edit1.mjs` and `rds-c1-edit2.mjs`.
- Mutation script: `rds-c1-mut.mjs`.
- Outputs: `rds-c1-m8-u1.txt`, `rds-c1-m8-t6.txt`, `rds-c1-m9-u1.txt`, `rds-c1-m10-t6.txt`, `rds-c1-m10-t8.txt`, `rds-c1-m12-v1.txt`, `rds-c1-m13-v1.txt`, `rds-c1-suite-kernel.txt`, `rds-c1-suite-shell.txt`, `rds-c1-verify.txt`, `rds-c1-build.txt`, `rds-c1-numstat.txt`.
