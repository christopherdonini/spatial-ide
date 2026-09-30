# Consult — node 2's worker report (kernel-ticket-liveness-redeem-wording, g1)

*Custodian's filing note: the worker-high's hand-back for PLAN node `kernel-ticket-liveness-redeem-wording` at node:kernel-ticket-liveness-redeem-wording@g1. Recorded verbatim below the rule, from the message, with the harness's report indentation removed. The custodian's checks before filing: the branch is pushed and clean at 616f20d on add5ef8, both signed off; the numstat totals 253 over the two files; `-U0` hunks of the product code carry no changed string literal (`lib.rs`: no non-comment changed line with a quote; `skp.rs`: the only non-test hunk, at `GenerationRegistry`'s doc, carries none, and the other hunk lies inside `mod ticket_drop_under_lock_regression`); both Product CI runs on 616f20d succeeded.*

---

node:kernel-ticket-liveness-redeem-wording@g1 -- DONE, pushed, no PR opened. Model observed: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff received or produced.

Built: branch cut/ticket-liveness-redeem, two commits on 6b77287. Diff is kernel/src/lib.rs and kernel/src/skp.rs only (merge-base 6b77287970e2bbaabfc9c76b43f30091ee7c1eeb).
- B = add5ef8: behaviour-preserving split of create_from_ticket into private `liveness_refusal` and `redeem_or_liveness_refusal` (at B this is `redeem` alone), plus R1-R4.
- C = 616f20d: the re-read, the why-sound doc, and symbol references in place of the line cites in `ticket_liveness`'s product-caller paragraph. The cites in `create_from_ticket`'s comment block had moved into `liveness_refusal` at B and were replaced there.
- I5: #146 touched only engine/; no symbol the form names changed. No I1-I6 fired.
- Caller grep (616f20d): `liveness_refusal` is called at lib.rs:424 (create_from_ticket) and lib.rs:495 (redeem_or_liveness_refusal). `redeem_or_liveness_refusal` is called at lib.rs:427 (create_from_ticket). Both are private; no new pub item.

B's failing assertions (P1 confirmed; 131 passed, 2 failed at add5ef8; R2 and R4 pass; every other suite identical to C's, only the lib summary line differs):
- R1 `an_end_between_liveness_and_redeem_refuses_by_its_code`: skp.rs:3746, `assert!(detail.starts_with("engine.source_changed: "), "{detail}")`. Message: "ticket `sh_...` was cancelled before it was redeemed".
- R3 `a_coverage_loss_between_liveness_and_redeem_keeps_its_own_code`: skp.rs:3783, the `engine.source_coverage_lost: ` prefix assertion. Same message.

C (616f20d): `cargo test -p spatial-kernel` rc=0, lib 133 passed / 0 failed, all other suites ok, same summary as B except the lib line. P2 holds.

Mutations, each applied at 616f20d, test run, reverted, porcelain empty after each:

| Mutation | Fails |
|---|---|
| M1: return `r`, delete the re-read | R1 at skp.rs:3748, the source_changed prefix assert. R3 also fails, at 3785. R2 and R4 pass. |
| M2: fallback always returns the source-changed refusal | R2 at skp.rs:3764 and R4 at skp.rs:3814, both `!detail.starts_with("engine.")`, with message `engine.source_changed: refused: ... (mutation)`. R1 and R3 pass. |
| M3: in `liveness_refusal`, map `EndedByCoverageLoss` to SourceChanged | R3 at skp.rs:3785, the coverage-lost prefix assert, with message `engine.source_changed: ... lost coverage}`. R1, R2 and R4 pass. |

No `verify-mutation` runs.

Checks:
- clippy (`--tests`) rc=0. Changed files have the same 3 `type_complexity` warnings as base, at different line numbers. My first attempt had a fourth on the new fn's return type; I added `#[allow(clippy::type_complexity)]` with a one-line reason, precedent in kernel/tests/scale_pass.rs and engine/src/rowgroup.rs.
- rustfmt `--edition 2021 --check`, stdin mode, Diff-hunk counts. Base lib.rs 16, skp.rs 99. At C lib.rs 16, skp.rs 99. My added lines are rustfmt-clean.
- Three lib.rs hunks are the moved `Some(terminal_detail_of(...))` arms, unformatted the same way at base. I left them: formatting them would re-indent the string-literal lines and break P3.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` from C:/dev/spatial-ide: 353 pass, 0 fail, rc=0. That runs the main checkout's scripts, as the brief said.
- verify-quotes --show-cites on both files: PASS, 0 checked.
- CI on the pushed 616f20d, both Product CI runs succeeded: "Rust workspace" run 36746337529 and "shell" run 36746337834.

P3 literal check:
- lib.rs: `git diff 6b77287...HEAD -U0 -- kernel/src/lib.rs | grep -E '^[-+][^-+]' | grep -vE '^[-+]\s*//' | grep '"'` returned nothing. The detail-literal lines are byte-identical to base.
- skp.rs non-test hunk (@@ -619): same filter, nothing.
- The test hunk (@@ -3653, +161 lines) adds string literals in R1-R4 and their helpers (fixture tags, `expect` and assert messages, the `engine.` prefixes). Tests cannot avoid these, so I read P3 as the product diff. Not a fix-needs-new-string case, but please confirm that reading at the gate.

Budget (§7): `git diff --numstat 6b77287...HEAD -- kernel/src` gives lib.rs 60/22 and skp.rs 167/4. Total added 227, deleted 26, sum 253 (limit 300), 2 files. No overrun.

Self-corrections, for the record:
1. My first B commit corrupted two string literals in the coverage-lost and source-changed details. The Bash tool collapsed a `\\` in my edit script, turning backslash-newline into a long run of spaces. I caught it at the P3 diff, and because B was unpushed I rebuilt and amended it (add5ef8). Every test and observation above is at the corrected commits, and the literal lines are byte-identical to base.
2. B also carries the rustfmt fixes for my added lines and the `liveness_refusal` signature. No behaviour differs between B and C other than R1 and R3.

Self-check, the four failure classes:
1. Cross-module interface: no cross-module change. START's `factory.create` arm in protocol/data-plane/src/server.rs is read and named by symbol only; no diff outside kernel/src. The end-to-end proof is T1 and T2, which are unchanged and pass. R1-R4 use real `open_dataset`, `viewport_query`, `close_dataset` and `host.cancel` on the real registries.
2. Completion claims: each claim above points to a run or mutation with its line.
3. User-facing messages: no new or changed message text; P3 is checked above.
4. Required tests reach the intended assertion: R1 and R3 fail on the prefix assertions at B, not in setup. Each test's state guard, `CancelledBeforeRedeem`, passes before step 2.

Off-scope, left alone:
- `ticket_liveness`'s doc still cites `engine/ADMISSION-PREREGISTRATION.md:742-744` by line. The form names only the product-caller paragraph.
- `SkpHost::generations`'s doc still carries a `frontends/shell/src-tauri/src/lib.rs:373-377` line cite.
- Nothing written under state/, PLAN.yaml, CUSTODIAN-QUEUE.* or site/. The form is not edited.

State: worktree C:/dev/wt/ticket-liveness-redeem on cut/ticket-liveness-redeem at 616f20d, pushed to origin, `git status --porcelain` empty. Cargo target at D:/wt-targets/ticket-liveness-redeem. No stray processes of mine are known.
