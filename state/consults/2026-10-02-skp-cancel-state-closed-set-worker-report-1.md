# Worker report 1 — skp-cancel-state-closed-set (2026-10-02)

*Custodian's filing note: the worker's hand-back on the brief for PLAN node `skp-cancel-state-closed-set` (form `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, committed 3f72519), recorded verbatim below with the harness's report indentation removed. No rooted `path:line` cite needed de-rooting; nothing in the text is changed.*

*The custodian's checks:*
- *branch `cut/skp-cancel-state-closed-set` at 190fd6b (B 2d835a9, C 5d4da4d, D 190fd6b), read from origin, worktree clean;*
- *the H1 hit and the commit-plan deviation the report names are recorded in the form's Amendment 1 (branch commit 8e4747e, class 2, before either gate).*

*Profile paths redacted at filing: none.*

---

All three commits are pushed on cut/skp-cancel-state-closed-set (head 190fd6b, worktree clean) and no PR is opened. P0 matched the prediction, so I1 and I2 did not fire. All five mutations were observed, and F7 matched. Every suite I ran was green except clippy, which I did not run.

**Commits**
- B 2d835a9 is test-only: T1, T3, T4, T5, the F2 and F3 fixtures, and the fixtures.rs round-trip extension.
- C 5d4da4d is the fix:
  - `CancelState` in Rust, with no `serde(other)` and no fallback.
  - The kernel's private `cancel_state_of`, and `CancelOutcome::as_str` removed.
  - The TS closed union `CancelState`.
  - The three kernel re-aims.
  - `REPORTED_DIVERGENCES` set to `&[]`.
  - T2.
- D 190fd6b holds the SKP-V0 text (§1 sentence and a §8 dated no-literal-change note, in my own words, no quotes). It also holds the RECORDED MUTATION docs for M1 to M5 and the DIVERGENCES.md update.

**P0 at B (2d835a9)**
- T1 `a_cancel_response_state_outside_the_closed_set_is_refused_at_deserialize` fails: `"cancelled" must be refused at deserialize`.
- `npm run typecheck` fails: `fixtures.test.ts(396,5): error TS2578: Unused '@ts-expect-error' directive`.
- T4 `the_real_cancel_responses_match_the_shared_fixtures` passes.
- T5 and the harness pass; `fixtures.rs` shows 23 passed.

**M1 to M5, each applied, run and reverted, all observed at C 5d4da4d**

| Mutation | Test run | First failing assertion |
|---|---|---|
| M1 | T1 | `"cancelled" must be refused at deserialize`; the harness also fails (pass=62 diverged=1, set-equality assert) |
| M2 | T2 | `already_terminal` vs `already-terminal` |
| M3 | `npm run typecheck` | TS2578 at fixtures.test.ts(396,5) |
| M4 | T4 | `{"state":"unknown"}` vs `{"state":"already_terminal"}` |
| M5 | `npm run typecheck` | TS2322 at fixtures.test.ts(402,72) and (406,7) |

No `verify-mutation` run is called an observation.

**F7**
- At B: `pass=62 deferred_to_host=15 diverged=1`.
- At D 190fd6b: `pass=63 deferred_to_host=15 diverged=0`. This matches the prediction of p+1 and d unchanged, so I8 did not fire.

**Suites, all at head 190fd6b**

| Suite | Result |
|---|---|
| `cargo test --workspace --locked` | rc 0; summed `test result` lines: 831 passed, 0 failed, 40 ignored |
| `cargo fmt --all -- --check` | rc 0 |
| `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check` | rc 0 |
| `npm run typecheck` (shell) | rc 0 |
| `npm test` (shell; its pretest runs a build) | rc 0; 72 files, 1096 tests |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | rc 0; 389 pass, 0 fail |
| `verify-cites` | rc 0; PASS |
| `verify-quotes` | rc 0; PASS |
| `verify-test-claims` | rc 0; PASS |
| `verify-mutation --base origin/main --head HEAD` | rc 0; PASS, all 5 new tests have a recorded mutation naming them |
| `profile-path-scan --staged` | clean before each commit |

- Clippy: product-ci-rust has no clippy step (its steps are `cargo build --workspace --tests --locked` and `cargo test --workspace --locked`), so I did not run it.
- The four verify tools were last touched at e9735d4 on the checked-out tree.
- Plain `npx vitest run` before a build failed 6 NOTICE tests; they need `dist-metafile.json`, so they passed once `npm test` built first. This is an environment ordering matter, not this change.

**§7 count** (the form's command, merge-base...HEAD, form excluded): 231 changed lines over 13 files, within 300 and 13. No class 8 applies.

**§6 item 1 grep, read hit by hit**
- No product code branches on `CancelResponse.state`, so I3 is clear.
- `kernel/src/skp.rs` is the writer (`cancel_state_of`, `SkpHost::cancel`).
- `frontends/shell/src/skp/client.ts:126` and `src-tauri/src/commands.rs:101` only name the type as a return type.
- `frontends/shell/src/App.lateResult.test.tsx:207` builds `{ state: "requested" }` typed `CancelResponse`. It is a hit outside §7's list and it "builds" a state, so H1 as worded is literally false. It compiles unchanged (typecheck rc 0), so compiling does not need that file and I did not read it as I6. For the custodian and the architect to judge.
- The remaining hits are unrelated `.state` fields.

**Deviations**
- DIVERGENCES.md (§2 item 6) landed in D, not C, because it names C's commit id (5d4da4d), which did not exist while C was being made.
- The §10 and §8 record items are untouched; I did not edit the form.

**Off-scope noticed, not done**
- The D1 historical text in DIVERGENCES.md still carries the old `commands.rs:460-465` and `types.ts:267-268` line cites. I kept them as the baseline record and said so in the Resolved line.
- The same file's two stale `kernel/src/skp.rs` line cites are replaced by function names, as §2 item 6 requires.

**Pre-gate four classes**
- Interface: the seam reads `SkpHost::cancel` (`kernel/src/skp.rs`, line 1515 at head) and `StreamRegistry::mint`/`redeem`, and T4 drives the real host.
- Completion claims: each points to a named test or command above.
- Messages: no user-facing text changed.
- Tests reach their assertions: M1 to M5 each fail at their intended assertion.

I ran as claude-sonnet-5-5 with no model override. I received no context handoff and produced none.
