# A's base suites at f64fac32, the worker's report

*Filed by the custodian, 2026-11-27. The run that A's form's Amendment 3 item 3 asks for before A's first code commit: the suites that start no app, at the base f64fac32f3c75da5b4ea57e5b38eee89b92ec22a in D:/wt/a2save (ADV-2026-11-27-09 item 2). A sonnet worker ran them, each cargo run in its own shared hold. Its run, from its completion notice only (ADV-2026-11-26-02), was 16 tool uses. Its first hand-back was an interim report, sent while the kernel run went on. Its second was refused by the harness as a second report, and the worker sent it again as a message when asked. Below the rule is that message, saved by Write with the harness's indent removed (2108 bytes, sha256 8f4d30556ce9a261ecfc997f89c98725466fabd8a7ff21b2f00115d9a55271d1), byte for byte. No gate-log row: this is a run, not a gate.*

---

Head f64fac32f3c75da5b4ea57e5b38eee89b92ec22a. GREEN: every run exited rc 0. Logs are in D:/wt/a2save-logs/. CARGO_TARGET_DIR was D:/wt/a2save-target. Each cargo run was in its own shared hold.
- `npm ci`, renderer/bundle-viewer: rc 0 (npm-ci-bundle-viewer.log)
- `npm ci`, frontends/shell: rc 0 (npm-ci-shell.log)
- `npm run typecheck`, frontends/shell: rc 0 (shell-typecheck.log)
- `npm test`, frontends/shell: rc 0, 132 of 132 files passed, 1669 tests passed, 0 failed (shell-test.log)
- `cargo test --locked -p spatial-engine --no-fail-fast`, D:/wt/a2save: rc 0, 491 passed, 0 failed, 20 ignored (cargo-test-engine.log)
- `cargo test --locked -p spatial-kernel --no-fail-fast`, D:/wt/a2save: rc 0, 521 passed, 0 failed, 48 ignored (cargo-test-kernel.log)
- `cargo test --locked -p spatial-skp --no-fail-fast`, D:/wt/a2save: rc 0, 63 passed, 0 failed, 0 ignored (cargo-test-skp.log)
- `cargo fmt --all -- --check`, D:/wt/a2save: rc 0 (fmt-workspace.log)
- `cargo fmt --all -- --check`, D:/wt/a2save/frontends/shell/src-tauri: rc 0 (fmt-shell-tauri.log)
- `cargo clippy --workspace --locked --all-targets`, D:/wt/a2save: rc 0, 17 lines starting with "warning" (renderer 2, engine 1, kernel lib 5, publish-bundle bin 1, duplicates not added) (clippy-workspace.log)
Since the interim report: the kernel run finished (rc 0, 521 passed, 0 failed, 48 ignored). The skp run, both fmt checks and the clippy run were then done, all rc 0.
Nothing unexpected:
- No exit codes 96 to 99 and no failures.
- The `npm test` log shows "Blocking waiting for file lock on package cache" lines. They are not failures.
- Free disk was 41,851 to 42,873 MB before the heavy runs, above the 40,960 MB floor.
- I started no app, no dev server and no e2e. I did not touch the main checkout, and I made no commit.
`git -C D:/wt/a2save status --porcelain` printed nothing at the end. HEAD was still f64fac32f3c75da5b4ea57e5b38eee89b92ec22a.
Pre-gate classes: not applicable. Nothing was built and no code was written.
Model: Sonnet 5.5 (claude-sonnet-5-5), per the harness note. No override. No context handoff received or produced.
