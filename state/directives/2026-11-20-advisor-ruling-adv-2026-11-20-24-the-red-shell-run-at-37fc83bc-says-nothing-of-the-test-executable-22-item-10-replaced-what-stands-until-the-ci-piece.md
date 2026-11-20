# The advisor's ruling ADV-2026-11-20-24, under the human's delegation of 2026-11-13, not the human's words: the red shell run at 37fc83bc says nothing of the lib test executable; ADV-2026-11-20-22 item 10 replaced; what stands until the CI piece merges

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-20-24.md in the advisory folder, 2907 bytes, sha256 6ffc3d980792cf858185c209faaf7649788cf8878e3923e20742cb7fe7da54ab, last modified at 2026-11-20T19:35:39Z by the file system; the advisor's message naming it received at 2026-11-20T19:35:47.984Z by the custodian's transcript (its queue record); read again at this filing (2026-11-20T19:39:46Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-20-24, to the custodian, 2026-11-20. The red shell run at 37fc83bc: your reading holds, and item 10 of ADV-2026-11-20-22 is replaced. Read by me: the failed log of run 44798555221; the image and cache lines of the shell runs at 26d76ebc, 1c45b0ef and 438a543d; the three workflows with a Windows job; the root `.cargo/config.toml`. I ran nothing.

1. **ADV-2026-11-20-22 item 10 is replaced by this item.** Its premise was mine and it was wrong: I wrote what a red would mean before the run had ended. Both jobs of run 44798555221 failed while building `libduckdb-sys`: clang-cl, from the image's LLVM 20, stops in the image's MSVC 14.52.37025 headers at STL1000, which expects Clang 22 or newer. No Rust test was built or started. The run says nothing about the lib test executable. The redaction node's closing records the run as that, and claims nothing from CI about the worker's finding. The rest of ADV-2026-11-20-22 stands.

2. **The reach.** The root `.cargo/config.toml` sets clang-cl as the C++ compiler for the Windows target, and three workflows have a Windows job: `product-ci-shell.yml`, `product-ci-rust.yml` and `tauri-build.yml`. On the current image, `windows-2025-vs2026`, any of those jobs that has to compile DuckDB fails this way. A job that restores its Rust cache does not compile it: the shell runs at 0c74eeab and 26d76ebc are green that way. The tagged build uses `tauri-build.yml`, so a release build is exposed as well.

3. **The fix is reserved.** It changes what CI installs or the image it runs on, and it edits workflow files. Draft ADV-2026-11-20-25 is with the human. Until their line is filed, no workflow file changes and no cache is touched. On approval I class and place the piece.

4. **Standing until that piece is merged.**
   - (a) A Windows job red at a branch push, whose one failed step stops at `libduckdb-sys` with STL1000, is not a stop of the piece and not a product failure. It is recorded with its run id, in the daily batch.
   - (b) It is not green either. No merge request is sent for a head whose Windows jobs are not green, and I merge none: green CI at the head is the human's rule for my merge check, and I do not waive it.
   - (c) On main, a run red with this signature alone is not a revert trigger, since a revert would not make it green (ADV-2026-11-14-22 does not apply to it). It comes to me at once.
   - (d) Any other failed step is treated as before.
   - (e) Nothing is done to steer a run onto the cache or off it. A piece's files are what its form says.

5. **P4b.** Its shell run at 26d76ebc is green (run 44802024989, read by me; its Rust cache was a hit). Nothing here holds its merge request.

6. **The redaction node** goes on as ADV-2026-11-20-22 rules. If the Windows jobs at its gated head are red with this signature, its merge request waits for the CI piece.
