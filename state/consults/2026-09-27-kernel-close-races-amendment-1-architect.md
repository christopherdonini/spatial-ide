*Custodian's filing note (2026-09-27): the architect agent's consult for PLAN node `kernel-generation-close-races` — the class-9 Amendment 1 after the merge of main at `ecc4a37` fired invalidator I2 — transcribed from the hand-back message with the harness's two-space indent removed; the fenced amendment is the returned text byte for byte, and it was appended as returned to §10 of `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` on `cut/kernel-generation-close-races` at `e2528ea` (append-only and byte-identity checked by `cmp`). Everything below the rule is the agent's text. On the agent's two notes: the loop wording was the custodian's brief's error (the setup is in the nested `check_one`); the `ecc4a37` observation is filed at `state/consults/2026-09-27-kernel-close-races-merge-observation.md`. Profile paths redacted at filing (0).*

---

cut/kernel-generation-close-races @ ecc4a37 (the worktree's HEAD per its reflog; I read the files in the worktree at that commit).

````markdown
### Amendment 1 — 2026-09-27, post-result: scope addition on round 23, item 2: the H3 sites B1 added to `main`, at the merge of `main`

Class 9 (scope addition). This amendment was written after the branch's merge of `main` (`ecc4a37`, main at `0ada14f`) was seen failing eight kernel tests. That run fired invalidator I2 as written. This is not a record correction. It touches §2e item 1's site list, H3's reach and §9's suites. It invalidates no §0–§6 result, but those results stand for `4682866` only. No code of the addition comes before this amendment: at `ecc4a37`, neither file named in 1.2 carries a `mint_for_open` line.

**1.1 Rule and cause.**
- Round 23, item 2 carries the addition: once this piece lands, the unheld path is unreachable.
- The eight tests in 1.2 call `viewport_query` on a name that is only in the catalog, with no `open_dataset` and no `mint_for_open`. That is H3's shape.
- On `main` they pass only because `live_or_mint` mints on demand, which is the path §2a item 2 deletes.
- B1 added them (#134, merged at `d6ec85a`), after this form's §0 grep at `3b421d5`.
- Round 22, item 1 is this node's authority, but it is not the rule that removes the path. Round 26, item 3 governs the merge, not this work.

**1.2 §2 shape.** One commit after this amendment's commit, touching only `kernel/tests/skp_projection.rs` and `kernel/tests/wire_bytes_invariant.rs`.
- Each site gets one line, placed directly after its `SkpHost::new(..)` statement.
- The line takes the form §2e item 1's sites already use in `kernel/tests/skp_admission.rs` at `ecc4a37`: `host.generations().mint_for_open(<handle>.as_str(), spatial_skp::v0::SessionRef::mint());`. This is a declared form, not a quote. The full path means no `use` line changes.
- `<handle>` is the name the site passed to `catalog.open`.

| Site | Test served | `<handle>` |
|---|---|---|
| `skp_projection.rs`, the test body | `a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns` | `req.dataset` |
| the same | `every_projection_refusal_is_synchronous_typed_and_pre_mint` | `handle` |
| the same | `every_projection_refusal_matches_its_committed_error_fixture_shape` | `handle` |
| the same | `a_filter_refusal_for_a_still_refused_type_keeps_todays_reason_byte_for_byte` | `handle` |
| the same | `columns_empty_list_is_refused_never_read_as_null` | `handle` |
| the same | `a_projection_composes_with_a_filter` | `handle` |
| `skp_projection.rs`, the nested `check_one` | `describe_projectable_agrees_with_viewport_query_admission_for_every_column` (all four `check_one` calls) | `handle` |
| `wire_bytes_invariant.rs`, the helper `collect_frames_via_ticket` | `wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too` (both calls) | `handle` |

That makes eight lines, and each line serves exactly one test.

**1.3 §4.**
- No new test is added. The eight are changed tests whose assertions do not change. Each one's mutation is its line removed.
- The run at `ecc4a37` observes that mutation, test-first. That tree is the addition commit's tree minus exactly these eight lines, and each line serves one test, so that run is each site's mutation applied. No separate per-site mutation is owed after the lines land.
- The custodian ran `cargo test -p spatial-kernel --no-fail-fast` there. It failed these eight tests, each with `skp.unknown_dataset`, and no other test.
- The observation of record is that run, filed by the custodian under `state/consults/` with the command, `ecc4a37`, the eight names and each failure's message. The reviewer re-makes it at the gate (round 25, item 2 (c)).
- The observation is not written into the tests' doc comments, which 1.4 keeps unchanged. A `verify-mutation` run is not its observation.

**1.4 §5.**
- **P6.** At the addition commit, every kernel target passes. The only change in outcome from `ecc4a37` is these eight tests.
- **Declared unchanged (added to §5's list).** In both files, every line except the eight:
  - every assertion and every `expect`/`expect_err` message;
  - every fixture, handle, `use` line, test name and comment.
- **B1's recorded-mutation comments.** Their rooted `kernel/tests/...` line cites shift under the insertions. This is disclosed and not corrected here: it is B1's test text, so the correction goes to the custodian as a proposed node.
- **Invalidators (stop and return to the architect):**
  - a site needs more than its one line;
  - any assertion or message must change;
  - the `ecc4a37` failing set, re-made, is not exactly these eight;
  - any kernel test fails at the addition commit.

**1.5 Disclosed, not part of the addition.** The merge `ecc4a37` carries `main`'s code into §2b's split, and adds no behaviour:
- In `kernel/src/skp.rs`, the mint step takes `build_viewport_query`'s `(query, projection)` as `main` does at `d6ec85a`, maps its refusals with `viewport_query_build_error_of`, and passes `projection.as_ref()` to `open_engine_stream`.
- `ticket_drop_under_lock_regression`'s `unrestricted_query` gains `columns: None`.
- The mint step's order stays §2b's and `main`'s: the live check, then `build_viewport_query`'s refusals, then the stream.

The closing record names the merge by commit only.

**1.6 §7.** §7 is not edited. Its command runs against the merge-base that the closing amendment names. The class-8 row (round 25, item 2 (a)) carries the line figure and the file figure, each with its commit.

**1.7 §8 and §9.**
- **Block-on-sight 18.** The addition commit touches any line of the two files other than the eight, or touches any other file. Or a line's form differs from 1.2's.
- **Block-on-sight 19.** The merge resolution reorders the mint step away from 1.5's order. Or a projection refusal becomes reachable after `open_engine_stream`.
- **Reviewer:**
  - the addition commit's diff (eight insertions, two files);
  - the `ecc4a37` observation, re-made by name;
  - the kernel suite at the head.
- **Architect:** 1.5 checked against `viewport_query` on `main` at `d6ec85a` and against §2b; 1.1's rule.
- **Suites.** §9's suites run at the head after the addition. The results at `4682866` do not speak for the merged tree.
````

Two of the brief's facts didn't match what I read, and there is one gap:
- `wire_bytes_invariant.rs` existed before B1: its `tracing_changes_no_byte_on_the_wire` test is from the tracing work. Only the projected test and `collect_frames_via_ticket` look like B1's. I read that from the file's content, not from git. Also, `describe_projectable…` does its setup inside the nested `check_one`, called four times, not inside a loop, and the wire-bytes setup is in a helper called twice. So one line covers each test.
- I have no Bash, so I could not read the merge commit's message body (the reflog subject matches), re-run the eight failures or the "290 passed" figure, or confirm the worktree is clean at `ecc4a37`. 1.3 therefore treats the `ecc4a37` run as the custodian's, to be filed and then re-made by the reviewer.

Files: `C:/dev/wt/kernel-close-races/kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `C:/dev/wt/kernel-close-races/kernel/tests/skp_projection.rs`, `C:/dev/wt/kernel-close-races/kernel/tests/wire_bytes_invariant.rs`, `C:/dev/wt/kernel-close-races/kernel/tests/skp_admission.rs`, `C:/dev/wt/kernel-close-races/kernel/src/skp.rs`, `C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md`, `C:/dev/spatial-ide/engine/B1-PROJECTION-PREREGISTRATION.md`.
