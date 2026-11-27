*Filed by the custodian: the worker's build report, node:large-utf8-and-utf8-view-attribute-columns@build-worker-1, on branch cut/large-utf8-and-utf8-view-attribute-columns (head a15a240d15987658f3aa26164e858ad9b22df0a6, base 69066c72f0a20a290b7d06fdb271c7e6edada5c1), dispatched at 2026-11-23T19:55:54Z. Its run: Bash 74, Read 4, Write 3, SubagentHandback 1, by unique call ids, 4 calls errored; model claude-sonnet-5-5, from 2026-11-23T19:55:55Z to 2026-11-23T21:23:37Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 6286 bytes, sha256 e8ed2fe28c323f6b8868896b78e0e835a699835d6a0f1316d4702a44051fd9dd, byte for byte, 2 values masked by the custodian (a project name, as <m>), with one final newline added. It is evidence for the closing amendment, not a gate.*

---

REPORT, LARGE-UTF8 piece (branch pushed, no PR)
Head a15a240d15987658f3aa26164e858ad9b22df0a6; commits e106af50 (P0 tests), cea0ef8c (fix), a15a240d (docs, ADR-023 note, recorded mutations). Tree clean. Model: claude-sonnet-5-5, no override, no handoff.

STEP 1 reads: admit_attribute_type, is_admitted_scalar, filterable_column_type, duckdb_type_name, E1, E2, CONFIGURE_SQL (engine/src/pool.rs), fixture::configured_connection (engine/src/fixture.rs), dataset::probe_schema's query_arrow, admit_projection and admit_projection_column. All match the form; no I3/I4. The form's line numbers are from 0bcf5434 and had drifted, but the content matched.

P0 (e106af50) failure lines, copied:
- T1 `a_large_utf8_or_utf8_view_column_duckdb_exports_is_not_projectable` FAILED, panicked at engine\tests\large_utf8_and_utf8_view_admission.rs:49:9: `LargeUtf8 must be refused by admit_projection_column`. The precondition (export is LargeUtf8) held first. The Utf8View case was not reached at P0.
- T2 FAILED, engine\src\attributes.rs:649:13: `Dictionary(Int32, LargeUtf8) must be refused`
- T4 FAILED, engine\src\predicate.rs:2737:13: `LargeUtf8 must not be filterable`
- T3 `the_product_configured_connection_exports_text_as_plain_utf8` ... ok

I1 PARTIAL, handled as the form's D2 allows: after the fix, T1's Utf8View case failed. The log line is `assertion left == right failed: SET produce_arrow_string_view=true must make DuckDB export VARCHAR as Utf8View` with `left: Utf8`, `right: Utf8View`. So produce_arrow_string_view alone does NOT export Utf8View on the bundled DuckDB. I tried `SET arrow_output_version='1.4'` beside it, as D2 says to try and record. That exports Utf8View, so I used the two SETs in T1, with a comment saying so. The arrow_large_buffer_size half of H-SET holds as written. Please read this as the form's allowed variant, not a stop. If you read I1 as "stop at the first failure", you have the fact.

Fix (cea0ef8c): targeted run `4 passed` for the lib tests (T2, T4, E1, E2), and the integration binary `test result: ok. 2 passed` (T1 and T3). The full suites follow below.

Mutations, each applied to a copy-backed file, run, restored; `cmp` of the file against HEAD's was equal each time, and the tree was clean. All observed at cea0ef8c, not committed; the RECORDED MUTATION comments are in a15a240d.
- M1 (T1): restore `| D::LargeUtf8 | D::Utf8View` in admit_attribute_type's arm. T1 FAILED at large_utf8_and_utf8_view_admission.rs:56:9 `LargeUtf8 must be refused by admit_projection_column`. T4 also FAILED, predicate.rs:2732:13 `LargeUtf8 must not be filterable`. This matches D3's predicted red set. cmp equal.
- M2 (T2): restore the two types in is_admitted_scalar. T2 FAILED, attributes.rs:650:13 `Dictionary(Int32, LargeUtf8) must be refused`. cmp equal.
- M3 (T3): append `; SET arrow_large_buffer_size=true` to CONFIGURE_SQL. T3 FAILED in its own test binary, large_utf8_and_utf8_view_admission.rs:80:5 `assertion left == right failed`, `left: LargeUtf8`. T1 stayed ok. The pool.rs change was temporary and reverted. cmp equal.
- M4 (T4): return Ok for LargeUtf8 and Utf8View before the gate. T4 FAILED, predicate.rs:2735:13 `LargeUtf8 must not be filterable`. cmp equal.

df -m /c reads, free MB: 42675 at 19:55Z; 42669 at 19:56Z; 42806 at the targeted fix run; 42753 and 42755 before the mutation runs; 42733 and 43044 around the suites. None was under 40960.

Suites:
- `cargo test --locked -p spatial-engine`: rc 0; 507 passed, 0 failed (summed over test binaries).
- `cargo test --locked -p spatial-kernel`: rc 0; 520 passed, 0 failed.
- No test outside E1 and E2 changed state (no I3).
- `cargo fmt --all --check`: rc 0.
- `node scripts/plan/verify.mjs` rc 0 (PASS).
- `node scripts/plan/verify-cites.mjs` rc 0 (PASS).
- `node scripts/plan/verify-quotes.mjs` rc 0 (PASS).
- `node scripts/plan/verify-test-claims.mjs` rc 0 (PASS).
- `node scripts/plan/verify-mutation.mjs --base 69066c72 --head HEAD` rc 0: "all 4 new test(s) have a recorded mutation naming them". It is a check only; the mutations above were applied by hand.
- `node --test` over the three script globs: rc 0; 623 pass, 0 fail.

Count, `git diff --numstat 69066c72...HEAD` over the six Scope files:
- ADR-023 note 10/0
- engine/README.md 4/3
- attributes.rs 20/5
- predicate.rs 22/6
- stream.rs 2/2
- the new test file 89/0
- Total 163 added+deleted lines, against 220.
- `git diff --name-only` over the range shows exactly those six files. Nothing else changed.

Texts copied:
- ADR-023 note: lines 367-376 of the form (the Amendment 2 item 2 fence), copied by node script. The appended tail of the ADR is `cmp`-equal to the saved note bytes. Before writing, the ADR ended with LF (183 lines). The diff is 10 insertions and 0 deletions, one hunk at the end.
- `grep -c -F` of the note's first-item line (the "What changes." line) = 1; of its "Why, in the engine's own facts." line = 1.
- My drafts: the README sentence (engine/README.md, the Attributes paragraph), the doc comment above admit_attribute_type (Amendment 2 D5's wording, shortened) and the T1 and T3 comments. They are in the committed files.
- No ADR-021 note, per OPEN-6.
- The README "Last verified at" clause cites cea0ef8c.

Caller grep: no `pub` item, callback or option was added. The new code is tests only; the production edits remove match arms and edit comments.

Hold lines (masked): `MACHINE_WAITING shared: turn of <m> held by pid <m> since <m>` appeared on several holds. `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>` and `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)` for each of the 6 holds. All were granted; no 96-99 exit.

Other facts:
- I ran one stray `git push -u origin cut/...-X` by mistake inside a compound line, with output discarded. It cannot have pushed anything (no such local ref). The real push was its own call and succeeded.
- verify-quotes ran while a hold was still waiting, so the node checks overlapped the cargo queue.
- No timing failure was seen.
- Nothing was stopped on apart from the partial I1 above.
- Off-scope, not done: renderer's admit_match_type and style.ts's admitsMatchKeyType are still wider than admission (C2, a renderer piece).
- The merge waits on the advisor ruling the ADR-023 note's words.
