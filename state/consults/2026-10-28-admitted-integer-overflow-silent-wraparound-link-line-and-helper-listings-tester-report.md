*Custodian's filing note (2026-10-28): the tester's report on the human's ruled evidence for #266: the link line captured locally at 49297300, the helper listings, A.1's product on the MSVC build. The custodian's check by its transcript: 3 cargo calls, 0 outside a shared hold by command text; 0 git writes. The raw files it names are in the local evidence folder, outside every repository; their sha256 values were recomputed by the custodian and match. The run 16:09:47Z to 16:51:43Z (Read 1, Bash 42, Write 1). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is d7c6aa2a11fbd26b55a279b8daa1c61162117e7000d39ecd23f50519d6e4716b.*

---

Captured: admitted-integer-overflow-silent-wraparound link line and listings at 492973009fbc1aaf31fcb12f6c974a0574ff1b4e

Helpers or clang_rt found: the DuckDB archives (a, b) hold none. clang_rt is absent from every input and from the link. Input (c), the engine test objects and the spatial_engine rlib, references three of the fifteen helpers, all from Rust-generated code:
- __fixdfti in the pinned test's own object (cgu.07.rcgu.o) and in spatial_engine's rlib (cgu.04.rcgu.o).
- __floattidf and __floatuntidf, each once, in spatial_engine's rlib (cgu.04.rcgu.o).
The link succeeded with no clang_rt library opened. The linker did open libcompiler_builtins-ce654cf527ce7df8.rlib, which is Rust's own. I did not trace which archive resolved them. This is the human's word.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No override, no context handoff. The brief's sha256 matched be0ceab1...f23e.

All raw files are in C:/dev/spatial-ide-local/evidence/2026-10-28 (the folder also holds a subfolder `8a`, not mine).

**Step 1: link line**
- The command ran in o1-clang, inside a shared hold, with CC_ENABLE_DEBUG_OUTPUT=1, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8. Exit code 0.
- The target held no release build, so this call built the release profile once, DuckDB included. Cargo's own line: `Finished `release` profile [optimized + debuginfo] target(s) in 32m 22s`.
- The raw file held 1062 `Searching` lines, so the `-W linker-info` rerun and o1-link-verbose-lib-2.txt were not needed.
- o1-link-verbose-lib.txt: sha256 bd8067f09e321f2edeb40a9ddf754f65e9b7aabdfaf7409b59dcdb7055e3d28b, 115964 bytes.
- The linker opened 152 distinct library basenames, deduplicated and sorted, with the `Searching` lines' stray ␍ glyph stripped. The sorted list is in my scratch file C:/dev/spatial-ide-local/scratch/o1t-libs2.txt.
  - 21 are system libs: advapi32, bcrypt, cfgmgr32, dbghelp, gdi32, kernel32, msimg32, msvcprt, msvcrt, ntdll, oldnames, opengl32, rstrtmgr, synchronization, ucrt, user32, userenv, uuid, vcruntime, winspool, ws2_32, all `.lib`.
  - 131 are `.rlib` files. These include libcompiler_builtins-ce654cf527ce7df8.rlib, libduckdb-8b28e01bdea462c5.rlib, liblibduckdb_sys-03621aeb157d9152.rlib and libspatial_engine-5875b76bf334ebcd.rlib.
- `grep -ic clang_rt` on the raw output printed 0; the grep exit code was 1.
- From the release libduckdb-sys `output` file (382 `running:` lines in all), counting the 352 lines that carry ` "-c"`:
  - DuckDB compile units: 352.
  - Naming clang-cl: 352.
  - Carrying DUCKDB_STATIC_BUILD: 352.
  - Naming cl.exe: 0.
  - The other `running:` lines are print-search-dirs, `-?`, `-E` compiler-family probes and llvm-lib calls.
  - The release archive out/duckdb.lib is 199148116 bytes.

**Step 3: DLL imports** (run before the step 2 relink replaced the binary)
- Binary: admitted_integer_overflow-b2b756c53d357a14.exe, linked by step 1.
- My first dumpbin call failed with exit 157: Git Bash rewrote `/dependents` into a path. It wrote only an error into o1-dumpbin-dependents.txt. I reran with `//dependents`, exit 0, and that rerun overwrote the file.
- o1-dumpbin-dependents.txt: sha256 08dc6dab544b70cd50552cb1281a4c82834d6e19a1fa1d97a176f397fec5ab8d, 985 bytes.
- DLL list: kernel32.dll, bcryptprimitives.dll, api-ms-win-core-synch-l1-2-0.dll, KERNEL32.dll, WS2_32.dll, RstrtMgr.DLL, ntdll.dll, USERENV.dll, MSVCP140.dll, VCRUNTIME140.dll, VCRUNTIME140_1.dll, and api-ms-win-crt-{string, math, runtime, heap, environment, filesystem, convert, stdio, locale}-l1-1-0.dll.

**Step 2: helper listings**
- Relink: `cargo rustc --release -p spatial-engine --test admitted_integer_overflow -- -C save-temps`, in a hold, exit 0, `Finished ... in 1m 14s`.
- The relink changed the test's hash from b2b756c53d357a14 to c372397881eb3c47. The 17 `rcgu.o` files under release/deps carry the new hash. Input (c) is those 17 objects plus libspatial_engine-5875b76bf334ebcd.rlib, which is the same rlib hash step 1 linked.
- Inputs:
  - (a) release duckdb.lib from the release libduckdb-sys `out` folder. o1-llvm-nm-a.txt: sha256 d4612343e78aeee589727870f60868f0682ebf1f18f466750fac62792e1f316a, 2732931 bytes.
  - (b) debug duckdb.lib on the same target. o1-llvm-nm-b.txt: sha256 1de4277112d2be2c84f3ac98a073dfa92959ed32db09831fadd3844781167368, 2732227 bytes.
  - (c) o1-llvm-nm-c.txt: sha256 89aa6b78141404150daafb8ec56bae25bcd2c8a69f203bacfb02ceaade48ab12, 604890 bytes.
  - llvm-nm exit code 0 for all three, with empty stderr for (b) and (c). I did not check (a)'s stderr: I redirected it to a stray file one level above the evidence folder and deleted it unread, so that stray write is a disclosure.
- Grep self-test: `grep -cE '[[:space:]]memcpy$'` found memcpy 289 times in (a), 289 in (b) and 31 in (c), exit code 0 each.
- Grep per helper (`grep -cE "[[:space:]]_?<sym>$"`, count and exit code):
  - __udivti3, __divti3, __umodti3, __modti3, __multi3, __muloti4, __mulodi4, __ashlti3, __ashrti3, __lshrti3, __fixunsdfti, __popcountti2: count 0, exit code 1, in a, b and c.
  - __floattidf, __floatuntidf, __fixdfti: count 0, exit code 1 in a and b. In c, __floattidf is 1, __floatuntidf is 1 and __fixdfti is 2, all exit code 0.
  - clang_rt (`grep -ci`): count 0, exit code 1, in a, b and c.

**Step 4: MSVC product**
- Setup: o1-msvc is detached at 5d9a7eb3, with `.cargo/config.toml` deleted as M1 left it. I wrote the untracked engine/tests/o1_imin.rs. `env | grep -E '^(CXX|CXXFLAGS)'` showed nothing (exit code 1).
- The command ran in a hold: `CARGO_TARGET_DIR=D:/wt-targets/o1-msvc CC_ENABLE_DEBUG_OUTPUT=1 timeout 600 cargo test -v -p spatial-engine --locked --test o1_imin -- --nocapture`. Exit code 0.
- The target was warm: the output shows `Fresh libduckdb-sys v1.10505.0` and no `Compiling libduckdb` (grep count 0). The run took `Finished `test` profile ... in 3m 20s` and `test result: ok. 1 passed`.
- Result line, byte-copied: `O1_IMIN_RESULT error=Out of Range Error: Overflow in multiplication of INT64 (-2147483648 * 4294967296)!`
- o1-msvc-imin.txt: sha256 85833ff8db7c0c88bd7a8e9ea6ab6b673b9ad1f3f764856c821a1a099b367436, 7672 bytes.
- I removed engine/tests/o1_imin.rs at the end.

**Holds** (my project only; all four granted, with release lines)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF`: step 1 build, the save-temps relink, and the step 4 test. Each was followed by `MACHINE_RELEASED project=SpatialIDE ... affinity=FF (cores 0-7)`.
- I used `M=...` as a shell variable for the script path rather than writing the path inline. Otherwise the call had the brief's shape.

**End state**
- `git -C C:/dev/wt/o1-clang status --porcelain` printed empty.
- `git -C C:/dev/wt/o1-msvc status --porcelain` printed ` D .cargo/config.toml`.
- Every command I started has exited. A cargo process started at 17:33:45 is still listed. I did not start it (my own cargo calls started at about 17:10, about 17:43 and about 17:55) and I did not touch it.
- I wrote scratch files only under C:/dev/spatial-ide-local/scratch, with names starting `o1t-`.

**The four failure classes for this harness**
- Harness uses the product's interface: step 4 goes through the `duckdb` crate's public connection API. Steps 1 to 3 are the toolchain's own commands on the real test target.
- Every result claim points to a file that exists: the six raw files above, with their hashes.
- Operator-facing lines describe what was measured at this commit: the clang-cl results are at detached 492973009fbc, and the MSVC result is at 5d9a7eb3 with the config deleted. No results file was written.
- Measurement tests reach their assertion: the step 4 test ran to the match arm and printed the result. It makes no assertion on the value, as the brief specified.

No token usage figures are at hand.
