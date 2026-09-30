# Consult — node 3's first piece, the worker's report (publish-refusal-codes-and-attempt-lifecycle, A4-4, g1)

*Custodian's filing note: the worker's hand-back for PLAN node `publish-refusal-codes-and-attempt-lifecycle` at g1, the first piece (A4-4, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`), delivered as a message on 2026-09-30 (enqueued 18:40:14Z). Recorded verbatim below the rule, from the message, with the harness's report indentation removed. The custodian's checks before filing: the branch is pushed and clean at 8b4f153 on 92045df and 4db0865 (all three signed off) from 8cee33b; `git diff --numstat 8cee33b...HEAD -- kernel/src kernel/tests` totals 44 over the two files the form names; the product diff in `kernel/src/lib.rs` is the one `map_err` line and a four-line comment, with no string literal outside the comment and no `pub` item; Product CI (Rust workspace, shell) succeeded on 8b4f153. The report's line numbers are unpinned working pointers at the branch commits it names.*

---

node:publish-refusal-codes-and-attempt-lifecycle@g1, A4-4. Model observed: Sonnet 5.5 (claude-sonnet-5-5), no override, no handoff. Branch cut/raw-path-refusal-code pushed at 8b4f153, no PR opened.

BUILT
- Sites at 8cee33b matched the form: the create-time site in `create_from_raw_params` (lib.rs:378), the mid-stream `terminal_detail_of` use (lib.rs:618, inside `EngineSource::next_into`), and START's `factory.create` refusal arm (server.rs:475-490). No stop.
- Commits, all with -s:
  - 4db0865 (B): T1, a new test modelled on `a_viewport_in_the_wrong_crs_is_refused_end_to_end`, whose text is unchanged.
  - 92045df (C): `.map_err(|e| skp::terminal_detail_of(&e))` at the site, plus a 4-line comment.
  - 8b4f153 (D): rustfmt form for T1's two asserts. It is not in the plan. It was needed because rustfmt reported one new hunk in end_to_end.rs.
- P0 at B: T1 fails at end_to_end.rs:546 with the message "the detail carries its typed code: refused: the viewport is expressed in EPSG:4326 and the dataset is in EPSG:2056. This slice performs no reprojection, so a viewport in another CRS cannot be honoured (docs/05: mixing CRS without a declared transform is an error)". So the detail arrived unprefixed, as predicted.
- Mutation observed at 92045df: I put `e.to_string()` back at the site and ran T1. It failed by name with the same prefix assertion, `a_create_time_engine_refusal_on_the_raw_path_carries_its_typed_code`, at end_to_end.rs:546. I reverted with `git checkout` and porcelain was empty. This was an applied mutation, not a verify-mutation run.

TESTS AND CHECKS (exit codes read directly)
- `cargo test -p spatial-kernel`: every test-binary result line was ok, none failed. end_to_end was 10 passed, including T1. The tests §5 declares unchanged (`h7_an_engine_refusal_arrives_as_a_typed_terminal_with_its_own_words`, `a_viewport_in_the_wrong_crs_is_refused_end_to_end`, typed_terminal_codes, skp_admission, post_check_cost_report) all passed.
- `cargo clippy -p spatial-kernel --tests`: exit 0, no warnings in the two changed files.
- rustfmt `--edition 2021 --check` hunks:

| File | At base 8cee33b | At HEAD 8b4f153 |
|---|---|---|
| lib.rs (counting only that file's hunks) | 16 | 16 |
| end_to_end.rs | 21 | 21 |

- At C, end_to_end.rs had 22 hunks; D removed the one T1 added. The repo has no rustfmt.toml, yet existing code is in the compact style.
- From C:/dev/spatial-ide, `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: exit 0. I did not capture the pass/fail counts.
- CI on 8b4f153: Product CI (Rust workspace) success in 20m23s, Product CI (shell) success.

§8 CHECKS
- `git diff --stat 8cee33b...HEAD` is 2 files, 43 insertions and 1 deletion: kernel/src/lib.rs and kernel/tests/end_to_end.rs only.
- The product diff in lib.rs is one code line changed plus 4 comment lines. Its +/- lines were: -`open_engine_stream(..).map_err(|e| e.to_string())?;`, then `//`, 3 comment lines, and the new `let (stream, cancel) = open_engine_stream(&ds, &query, None).map_err(|e| skp::terminal_detail_of(&e))?;` split over two lines. It adds no string literal (the only quoted text is in a comment) and `grep -c 'pub '` over the diff is 0.
- No prefix is composed outside `terminal_detail_of`.
- T1 has no timing assertion.
- Consumer grep over frontends/ and protocol/ for prefix or equality matching on the create-time detail found only `formatTerminalRefusal.ts` and `liveTicketSet.ts`. They parse a generic `"<code>: "` prefix, which is the shape already in use mid-stream. I found no equality or prefix match on the raw-path create-time detail, so no invalidator fired. The architect should still confirm this.

BUDGET (§7)
- `git diff --numstat 8cee33b...HEAD -- kernel/src kernel/tests` at 8b4f153: lib.rs 6/1, end_to_end.rs 37/0. Total 44 lines, 2 files, against the 60 and 2 ceiling. Within budget.

PRE-GATE SELF-CHECK
1. Cross-module: the change calls `skp::terminal_detail_of`, which exists and is used at lib.rs:618. The end-to-end path runs through the real data-plane server with `EngineSourceFactory`.
2. Completion claims: each points to the failing or passing test run recorded above.
3. User-facing messages: no string was added or changed.
4. Assertions: the T1 failure at B and at the mutation is at the prefix assertion at end_to_end.rs:546, which is its intended assertion and not setup.

OFF-SCOPE, NOT DONE
- The first cold cargo build took about 15 minutes.
- Nothing was written under state/, PLAN.yaml, CUSTODIAN-QUEUE.* or site/, and the form is unedited. The worktree status is clean.
