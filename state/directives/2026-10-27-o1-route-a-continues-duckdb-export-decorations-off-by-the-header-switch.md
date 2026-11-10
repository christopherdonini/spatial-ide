# The human's message of 2026-10-27: O1's route (a) continues, DuckDB's export decorations switched off by its header's own switch

*Filed verbatim by the custodian from the session transcript (received 2026-10-27T20:24:20.996Z), its text unchanged; the message came as one pasted block with no other words, and the paste's wrapper is not part of the text; nothing in it names another project. The RULED block in DECISIONS-PENDING.md is the custodian's summary; the text below is the ruling.*

---
To the custodian, 2026-10-27.

Route (a) continues; the fallback has not fired. The header's own switch is used, not the build script's define. In duckdb/common/winapi.hpp, DUCKDB_API is defined only under #ifndef DUCKDB_API, and its Windows branch takes dllexport only when DUCKDB_STATIC_BUILD is not defined. So:

1. The tester reads winapi.hpp in the vendored 1.5.5 source first and reports the macro structure, byte-copied. If DUCKDB_STATIC_BUILD is honoured there, the define is -DDUCKDB_STATIC_BUILD; if not, it is -DDUCKDB_API= (empty, the non-Windows configuration). It also greps the vendored source for every other use of the chosen macro and reports them; a use outside winapi.hpp that changes behaviour stops for my word.
2. The define goes into the same .cargo/config.toml [env] table, for the Windows target only, as CXXFLAGS_x86_64-pc-windows-msvc, beside the CXX entry. Nothing in the crate, its build script or its source is changed; the dependency version stands.
3. One more cold clang-cl build on the probe's target, under H2's booking, which extends to it. The build log is checked as before: clang-cl only, and the define present on every DuckDB unit. Then P0 as the form has it.
4. If this build fails too, or a pass criterion fails that is not a build failure, it stops and comes to me (OPEN-4 (A)); route (b) is then the route, with its ADR-021 Note in my words.

The build-of-record sentence gains a clause after "(CXX_x86_64-pc-windows-msvc=clang-cl)": ", with DuckDB's export decorations switched off for this static build (<the define the tester confirms>), because clang-cl rejects the exported deleted functions in DuckDB 1.5.5's variant_stats.hpp". The gate checks it against the config and the header.

Nothing else moves: route (b)'s pre-code work stays unstarted.
