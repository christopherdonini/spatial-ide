# The default Rust suites and the shell's install beyond Windows (wave-1 D-1 to D-4) -- five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any code, per the header rule both full and short forms keep. The cut is wave 2's W2-D: the custodian's commit follows this one, and the cloud worker's commits follow that.*

```
Authority: PLAN node suites-and-toolchain-beyond-windows, placed by the human on 2026-09-28 (state/directives/2026-09-28-wave2-D-sighting.md, which also carries Fable's sighting of this cut's brief, points 1-5); wave-1 D-1 to D-4 (state/cloud/wave1/D.md); state/cloud/wave2-prompts.md §3 item W2-D
Scope: 8 files; <= 60 non-generated lines. The custodian's commit: kernel/src/permission/boundary.rs (its #[cfg(test)] module only), CONTRIBUTING.md, CLAUDE.md. The cloud worker's commits: engine/tests/lod_tier_builder.rs, engine/tests/lod_tier_cancellation.rs, engine/tests/lod_tier_preflight.rs, kernel/tests/no_generation_in_persisted_artifacts.rs, engine/tests/common/mod.rs
Change: on non-Windows hosts the 14 tests that need the Windows-only LOD tier root are ignored with a stated reason, boundary.rs's Windows-path assertion runs on Windows only, and POLYGONS_100K resolves under the workspace target directory instead of a Windows literal; CONTRIBUTING.md and CLAUDE.md state the npm floor (npm 11+, CI's Node 24); on Windows nothing that runs changes
Tests+mutation: no test is added, so no mutation is owed; 14 tests each gain one cfg_attr(not(windows), ignore) line and one assertion statement gains cfg(windows), names and bodies otherwise unchanged; the verifiers are Windows CI green on the PR, the worker's Linux workspace run with 0 failed and no file named with a backslash, and the custodian's Windows test lists (default and ignored) identical on main and on the PR head
Out-of-scope: ADR none; security none (boundary.rs's non-test lines unchanged); wire none; guarantee none (on Windows, the only platform product CI runs, the tests that run and those ignored are identical before and after)
```
