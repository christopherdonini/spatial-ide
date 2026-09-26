*Custodian's filing note (2026-09-26): the worker-high's hand-back for PLAN node `data-plane-stream-registry-bound` at e061cb1, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

Piece: `data-plane-stream-registry-bound`. Branch `cut/data-plane-stream-registry-bound` pushed at `e061cb1` (origin updated `8dbaec5..e061cb1`).

**1. Commits**
- `2b99551` fix(data-plane): bound StreamRegistry by a declared age and terminal-record count — §2 items 1-7 in `server.rs` (two constants+floors, `state`/`StreamRegistryState`/`TerminalRecord`, `prune_locked`, `handle`'s `pump::spawn` Err arm now calls `record_terminal`) plus T1-T5, all in one commit as required.
- `e061cb1` docs(data-plane): record the five §4 mutations above their tests, comments only.

**2. Test-first run** (uncommitted, registry body unchanged, before `2b99551`): T1 failed `left: 200 / right: 64` (200≠MAX_TERMINAL_RECORDS); T2 failed its count assertion (`left: 73 / right: 65`, i.e. `MAX_TERMINAL_RECORDS+9` not `+1`); T3 passed. Matches §4's prediction exactly.

**3. Post-fix suites, all at `e061cb1`** (toolchain `rustc 1.97.1 (8bab26f4f 2026-07-14)` / `cargo 1.97.1`):
- `cargo test -p spatial-data-plane -- --test-threads=1`: rc 0, 24+11+4+5+3 = 47 passed, 0 failed (includes T1-T5).
- `cargo test -p spatial-kernel -- --test-threads=1`: rc 0, 32 test binaries all `ok`, 0 failed (log captured to a scratch file since normal capture truncated a first attempt on a slow DuckDB rebuild).
- `cargo fmt --check -p spatial-data-plane`: reports diffs on both touched files, but every one matches a pre-existing style pattern already present verbatim on `origin/main` at commit `522493a` under this local rustfmt 1.9.0 (confirmed by diffing untouched sibling files, which show byte-identical pre-existing diffs at the same call shapes — no `rustfmt.toml` pins a version/config). Kept single-line where main's own ambient style does, to hold the line budget; this is a disclosed choice, not a silent pass.
- `cargo clippy -p spatial-data-plane --all-targets`: rc 0, zero warnings.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: 311/311 pass, rc 0.
- `verify-quotes.mjs`: PASS (109 checked, 78 verified, 30 pre-existing baselined, 1 advisory — none from this piece).
- `verify-cites.mjs`: PASS (754 files, all rooted cites resolve — advisories are pre-existing elsewhere).
- `verify-test-claims.mjs`: PASS (237 claims across 82 files; none of mine flagged).
- `verify-mutation.mjs --base origin/main --head HEAD`: PASS — all 5 new tests named with a recorded mutation.
- `timeout 120 node scripts/plan/verify.mjs --offline`: PASS.

**4. The five mutations** (each applied once, run, reverted; `git diff --stat` empty after each revert — confirmed):
- M1 (T1): count prune removed, age prune only → `the_registry_retains_at_most_the_declared_count_of_finished_streams` failed, `200 ≠ 64`.
- M2 (T2): count prune evicts oldest by admission order (`streams`), live or terminal → `a_live_stream_is_never_pruned_at_the_count_ceiling` failed on its live-entry assertion.
- M3 (T3, outside the diff in `adapter_ws::drive`): reader aborted immediately after the terminal frame, skipping `PEER_DRAIN_TIMEOUT` → `a_cancel_after_the_terminal_frame_is_still_observed_by_the_producer` failed (`state.is_cancelled()` false).
- M4 (T4): `record_terminal` deletes the entry it just recorded → `a_terminal_record_survives_its_terminal_and_is_kept_within_its_declared_age` failed (panicked earlier, at the backdating lookup, since the entry no longer existed to backdate — still a failure of the named test, recorded as observed).
- M5 (T5): age prune removed, count prune only → `a_terminal_record_older_than_its_declared_age_is_pruned_on_the_next_record` failed on its own named assertion.

All five recorded as comments directly above their tests in `e061cb1`, copied by script (`insert-mutation-records.mjs`, run from scratch, not committed) from the actual captured cargo output, never retyped; durations cut per the rule.

**5. §7 figures** — `git diff --numstat origin/main...HEAD` (generated files and the preregistration excluded per §21c, confirmed those generated diffs exist separately and don't count): `server.rs` 224+19=243, `stream_registry_bound.rs` 327+0=327. **Total 570, against the declared ≤450 — over by 120.**

**6. Deviation.** Class 6 (AUTONOMY.md §21c / `docs/PREREGISTRATION-TEMPLATE.md`: "budget deviation, Scope not edited") — Scope (the two files) is unchanged, only the line count. Cause: (a) three real end-to-end tests over an actual socket need connect/send/drain/poll scaffolding the origin-non-ascii sibling piece's simpler header-only tests didn't; T1 alone drives 200 full round-trip streams. (b) the five mutation records, mandated by §4's own recording step, add ~85 lines across both files that weren't in §7's pre-code planning estimate. I trimmed hard before committing (an initial straightforward draft was ~830 combined; cut to 570 by consolidating the two synthetic `BatchSource` structs into one enum, one shared `read_terminal_code` helper reused by all three E2E tests, and tighter comments) without cutting any required property, real-shape rule, or citation. I did not gut further because the remaining lines are load-bearing test logic or comments the rules require (hang-bound labels, §2/§0 citations, the mutation records themselves) — cutting them would trade a numeric overrun for a rule violation. Not a stop: no §5 invalidator fires (scope, `pub` surface, dependencies, existing tests, and H1/H2 are all as declared), and §7's budget line isn't in the invalidator list.

**7. No stop.** No invalidator was hit; §2's seven items landed unmodified from the form's stated shape.

**8. Final `git status --porcelain`:** empty (clean, matches pushed `e061cb1`). No cargo/rustc/cl/link process remained running (checked by exact process name after both suites completed).

Files: `C:\dev\wt\stream-registry-bound\protocol\data-plane\src\server.rs`, `C:\dev\wt\stream-registry-bound\protocol\data-plane\tests\stream_registry_bound.rs`.

Model: I ran as the assigned worker-high (Sonnet 5, no override).
