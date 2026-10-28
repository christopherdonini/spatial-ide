# The human's message of 2026-10-28: #266's link line captured locally, and the 128-bit helper listing beyond the archive check

*Filed verbatim by the custodian from the session transcript (received 2026-10-28T13:24:49.614Z), its text unchanged; nothing in it names another project. The human sent it first, interrupted, with the words "Mrged both" before it (#264 and #265 merged, recorded as done in this commit), and then in full; the full text is filed, its last line the human's own note that the earlier copy was cut short. The RULED block in DECISIONS-PENDING.md is the custodian's summary; the text below is the ruling.*

---
To the custodian, 2026-10-28.

#266, the link line: captured once, locally, by the tester in the probe worktree on the clang-cl target, nothing committed: cargo rustc --release -p <the engine crate> --test <the pinned test's file> -- -C link-arg=/VERBOSE:LIB, which relinks that binary alone (no RUSTFLAGS: that would rerun the build script and rebuild DuckDB). The raw output goes to C:\dev\spatial-ide-local\evidence\2026-10-28\o1-link-verbose-lib.txt, outside the repository, its sha256 in the report. The filed report carries the library basenames the linker opened, deduplicated, no paths, and the grep for clang_rt. Nothing is added to CI for this.

#266, beyond the archive check: yes. llvm-nm --undefined-only over the DuckDB archive and over the engine test objects, grepped for the 128-bit helpers (__udivti3, __divti3, __umodti3, __modti3, __multi3, __muloti4, __mulodi4, __ashlti3, __ashrti3, __lshrti3, __floattidf, __floatuntidf, __fixdfti, __fixunsdfti, __popcountti2) and for clang_rt; dumpbin /dependents on the test binary for its DLL imports. Outcome: none referenced and no clang_rt library opened, and the ADR-030 record says so in one sentence; any of them referenced means compiler-rt resolved it, and the PR stops for my word, because the bundle's third-party notices then gain compiler-rt's licence. The two listings are filed with the P0 amendment.

The previous one got trim
