*Custodian's filing note (2026-11-15): the report of the lod-tier-tests-own-tier-folder worker, from its hand-back (7755 bytes, sha256 b8720a6d57487c1c17d2069313e13b22f5064348eff102ce98e23e784996601e), below the rule, byte for byte but in its cites: each of its 6 cites of a file and a line is given in words here (the file, then the line), so that the cite check does not read one against main, and two of them name a file by its bare name. Its brief by file (15370 bytes, sha256 a0aacab0005ead49b22383a30c3e86e3bf34c20cf1e624277aa5579c03f98c9b), with the dispatch prompt naming it by its place. The run 2026-11-15T17:02:37Z to 2026-11-15T18:15:45Z by its transcript, 114 calls (Bash 81, Read 23, Grep 2, Edit 5, Write 2, SubagentHandback 1), 2 errored calls (a refused foreground sleep, and a write to a file changed since its read), model claude-sonnet-5-5. Its opening line is the one its brief gave. The rule of ADV-2026-11-15-17 item 4 was sent to it at 2026-11-15T18:07:39Z, after its last hold had begun; the form's Amendment 1 records its holds.*

---

Stopped: lod-tier-tests-own-tier-folder at 36c12ff285280f0549b792f0f98420a5bdae9aa6, step 4 (P-0 (b)), because the grep does not come out empty. Two commits are made, nothing is pushed, and M1, M2 and commit 3 are not done. The new rule from ADV-2026-11-15-17 item 4 reached me after the status check before run 1, so no hold I used had its post-grant status step. No chain was stopped by it.

**Why I stopped**
- **`lod_tier_root.rs`:** `engine/tests/lod_tier_root.rs, line 26` reads `use spatial_engine::lod::{build_tiers, LOD_BUILD_WORKERS_ARM_S, LOD_TIER_ROOT_UNRESOLVED};`.
  - The form and the brief both say that file is unchanged.
  - It sets a relative `LOCALAPPDATA` and the build is refused before any write.
  - Building through the wrapper would break it, because the wrapper's first call replaces `LOCALAPPDATA`.
- **`lod_tier_measurements.rs`:** `engine/tests/lod_tier_measurements.rs, line 15`, a `//!` doc line, still names `spatial_engine::lod::build_tiers`. That is a Scope file I could edit.
- **My reading (a paraphrase of mine):** (b) was meant to cover the files that build into the tier root, which are the four suites. Those four are clean: B6 shows each imports `build_tiers` from `common`. The literal wording fails at the base commit too. Please rule on the wording.
- **Evidence:** `<S>/lodt-p0b-greps.txt` (B1 to B6).

**Where checks**
- **Worktree:** HEAD was d2008810bf095a6983a3aa7915d277d83a30b21c with an empty porcelain.
- **Config hash:** the `.cargo/config.toml` sha256 was 6889110645ec075c0cba3bf4aa71c4b43e5b5dfafe7d5a3e8228c05c5010e35f.
- **Cites:** `git diff --quiet 68857b9e6771296c506134281ece3d202e9366eb d2008810bf095a6983a3aa7915d277d83a30b21c -- engine kernel` exited 0.

**P-0 (a), (c), (d)**
- **(a), the §C statement:**
  - **Kernel test binary:** `git grep` shows the only users of `data_dir` are `resolve_log_path` at `log.rs, line 358`, `default_root` at `session_history.rs, line 249` and `projects_root` at `store.rs, line 57`.
    - The binary reaches `AuditLog::open_for` once, with `AUDIT_LOG_ENV` set. It passes explicit roots to `StepRecorder::new` and `Projects::new`.
    - `watch_support/mod.rs` has no reads.
  - **Engine binaries (`lod_tier_builder`, `lod_tier_cancellation`, `lod_tier_measurements`, `lod_tier_preflight`):** nothing in `engine/src` reads the data directory. `user_data_dir` has one caller, the kernel's `data_dir` at `log.rs, line 378`.
  - Nothing there depends on the machine's real directory. The calls are in `<S>/lodt-p0a-greps.txt`.
- **(c):**
  - **Toolchain:** rustc 1.97.1.
  - **Page:** `<sysroot>/share/doc/rust/html/std/env/fn.set_var.html`.
  - **Sentence (byte-copied, with the page's line break shown as a space):** "This function is also always sound to call on Windows, in single-threaded and multi-threaded programs."
  - **Edition:** both crates are edition 2021, where `set_var` is not `unsafe` to call.
- **(d):**
  - **Compile:** the throwaway `env!("CARGO_TARGET_TMPDIR")` test compiled in both crates (`engine rc=0`, `kernel rc=0`; the cold build took 12m 48s).
  - **Cleanup:** both files are deleted and the porcelain was empty.
  - **Word check:** a find under `D:/wt-targets/lodt` for names containing "generation" returned none.
- **Departure:** that first hold ran both cargo calls inside a parenthesised group. The brief says the command is not inside parentheses. I used one command per hold after that.
- **Machine-wide tier folder at P-0:** count 1, list sha256 0bb61523d9dd881eefd6176b3ae13f379ed6f7297f85e8243f391ace9b37f5ae.

**Commits**
- **fb51f0ac4c34d68ad9d444daf3126e9fe104a2c9**, "test: lod-tier-tests-own-tier-folder, the change: each LOD test process builds its tiers in its own folder". It touches 6 files, +214 and -64.
  - **Helper:** `common/mod.rs` gets `tier_run_root`, a lock file and a finished-run sweep, `inherited_local_app_data`, and the `build_tiers` wrapper.
  - **Sites and floors:** all tier-path sites go through the helper, and the 5 GB floors read the volume of the run's folder (a local `free_bytes_on_run_volume` in the builder and measurements files).
  - **Preflight:** it calls the helper first.
  - **Kernel test:** the LOD test uses an `OwnTierRoot` guard on `kernel-lod-tier-run-<pid>`, outside `lod-tier-runs/`.
  - **Not touched:** `engine/README.md` is not touched yet. No assertion's expected value changed (the only `assert` text in the diff is comment words).
- **36c12ff285280f0549b792f0f98420a5bdae9aa6**, "test: lod-tier-tests-own-tier-folder, T-A, T-B and T-B's second-process half". It touches `lod_tier_builder.rs` only, +131. It adds T-A, T-B and the child half, each with a doc comment and no sleep or timer.
- **Message files:** both have an `@` only in the first trailer line.

**Runs**
- **Commit 1, engine (4 binaries, rc 0):**
  - `test result: ok. 17 passed; 0 failed; 2 ignored; 0 measured; 0 filtered out; finished in 789.30s` (builder)
  - `test result: ok. 1 passed; 0 failed; 1 ignored; 0 measured; 0 filtered out; finished in 33.45s` (cancellation)
  - `test result: ok. 1 passed; 0 failed; 4 ignored; 0 measured; 0 filtered out; finished in 0.00s` (measurements)
  - `test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.20s` (preflight)
- **Commit 1, kernel (rc 0):** `test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 3.76s`.
- **Run 1 at commit 2 (rc 0):** `test result: ok. 19 passed; 0 failed; 3 ignored; 0 measured; 0 filtered out; finished in 743.11s`. T-A and T-B report `... ok` and the child half reports `... ignored`.
- **Machine-wide tier folder:** the count and sha256 are unchanged after each of those runs (`lodt-tiers-c1.txt`, `-c1k.txt`, `-run1.txt` all equal `lodt-tiers-0.txt`).
- **Not done:** runs 2 to 6 (M1, M2, whole engine crate, kernel, clippy), the light checks, the push and CI.

**Size**
- `git diff --numstat d2008810...HEAD` sums to 345 insertions and 64 deletions, 409 in all, against 260. That is over before commit 3 (README and `RECORDED MUTATION` comments).
- The form's term (a) says to report it, not trim it.

**Other departures and disclosures**
- **Sweep lock:** the sweep opens each sibling `<pid>.lock` with `share_mode(0)`, as the draft's N4 describes, and removes the folder only if the open succeeds.
- **M2 as I wrote it:** the one-line M2 would be replacing `let Ok(finished) = ... else { continue };` with `let finished = ...;`. It is not applied.
- **Off Windows:** `tier_run_root` creates nothing and sets nothing. T-B's child half is ignored on every platform.
- **Run folders:** each run leaves its folder under `D:/wt-targets/lodt/tmp/lod-tier-runs` until the next run's sweep (two are there now).

**Status readings and hold lines (masked)**
- **Status 1:** a `project=SpatialIDE` line was present. Reading: average 27.9%, peaks-over-25 37, quiet=False. I waited one 60 s turn.
- **Status 2:** no project line, average 18.9%, peaks 5.
- **Status 3, 4, 5, 6:** no project line, averages 30.5%, 31.0%, 30.3%, 63.6%, peaks 60 each.
- **Status 7 (taken during my own run 1 hold):** one project line, average 28.0%, peaks 56.
- **Hold lines:** each was `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<n> also=<m> (commands started from now on inherit it; release when done)`, followed by `MACHINE_RELEASED`. The first hold line I used was the P-0 (d) one. There was no MACHINE_WAITING, no MACHINE_ERROR and no exit 96 to 99.

**Left running:** no background shell and no process I started. The worktree `C:/dev/wt/lodt` is on `cut/lod-tier-tests-own-tier-folder` at 36c12ff2 with an empty porcelain. `git ls-remote origin cut/lod-tier-tests-own-tier-folder` returns nothing, so the branch is not on origin.

**Model:** claude-sonnet-5-5 (Sonnet 5.5).
