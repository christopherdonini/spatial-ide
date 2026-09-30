*Custodian's filing note (2026-09-30): the architect's gate 1 on PR #147, for PLAN node `kernel-ticket-liveness-redeem-wording` at generation 1, full gating. Reviewed: cut/ticket-liveness-redeem @ 616f20d (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 616f20d. It confirms the form's reading R, so invalidator I6 does not fire. N5's two stale cites are routed to PLAN node `kernel-close-races-followups` (stale `skp.rs` cites). Profile paths redacted at filing: none.*

---

Reviewed: cut/ticket-liveness-redeem @ 616f20d

**Verdict: PASS with notes.** `cut/ticket-liveness-redeem @ 616f20d` (B = add5ef8, merge base 6b77287). Architect gate 1, PR #147, node:kernel-ticket-liveness-redeem-wording@g1. No blocking findings.

I have no Bash, so I could not run `git diff`. I checked the diff by reading the worktree against main (main's `kernel/src` equals 6b77287 there). The line offsets agree with the worker's numstat: lib.rs moves +38 below the changed region (60 − 22), and skp.rs moves +2 below the doc hunk and +163 at the end of the file.

**1. Reading R (form §0 item 3): PASS. I confirm R; I6 does not fire.**
ADR-035 Decision 2, second sub-bullet, says every later generation-scoped call "refuses by name". Its redemption bullet names redemption of a ticket from the ended generation, refused by name "while the dead-ticket record holds", and it lets the answer fall back to `redeem`'s own refusal only "After the record ends".
- A START whose refusal is decided by `redeem` after `end_generation` has recorded the end takes effect at that `redeem`. So it is a later call on a ticket from the ended generation, made while the record holds.
- Answering `redeem`'s cancelled wording in that window is the degraded answer, which D2 allows only after the record ends. The same bullet's "The refusal is the authority" is what the fix restores.
- §1(iii) makes the same point: running `create_from_ticket` whole at the final read would already take the dead-ticket arm.

**2. The diff against §2a–2d and §8 items 1–4: PASS.**
- **§2a.** `create_from_ticket` (lib.rs, `EngineSourceFactory`) is parse → `liveness_refusal` → `redeem_or_liveness_refusal`. Both steps are private, and there is no new `pub` item.
- **§2b.** The body is `tickets.redeem(handle).map_err(|refusal| Self::liveness_refusal(generations, handle).unwrap_or(refusal))`. `Ok` passes through untouched.
- **Locks.** `redeem` releases its own guard before it returns, and the closure runs after that. No lock is held across `redeem` or the re-read, and no locks are nested.
- **Tests only in the test module.** There is no `cfg(test)` in lib.rs. The only product hunk in skp.rs is `ticket_liveness`'s doc; everything else is inside `mod ticket_drop_under_lock_regression`.
- **Nothing out of scope changed.** `StreamRegistry`, `GenerationRegistry`, `SessionInvalidator::end_generation` (record, enqueue, cancel, in that order) and `TicketState` are unchanged apart from that one doc paragraph.
- **No hooks.** The tests reach the private steps through ordinary in-crate privacy (skp is a child of the crate root), with no hook.
- **ADR-019:** the params blob is still the handle alone, and no new admission path exists.
- **ADR-006:** no operation changes class. The re-read is a registry read.

**3. P3 and §8 item 5, read as product code: PASS.** §4 requires R1–R4 to assert the `engine.` prefixes, which cannot be done without literals, and I2 is about what "the fix needs". So P3 and §8 item 5 bind the product diff.
- In lib.rs, the moved arms change only `Err(` to `Some(`. Both detail literals are byte-identical to base (lib.rs, `liveness_refusal`, compared with base `create_from_ticket`).
- `#[allow(clippy::type_complexity)]` is an attribute, not a literal.

**4. §8 items 6 and 7: PASS.**
- `Live | Unknown => None` (lib.rs, `liveness_refusal`). A `None` at the re-read leaves `redeem`'s refusal standing.
- `EndedByCoverageLoss` maps to `SourceCoverageLost`. R3 asserts the coverage-lost prefix and `!starts_with("engine.source_changed")`. The worker observed M3 fail R3 at 616f20d.

**5. The doc added in §2c: PASS; it is true at 616f20d.**
- `end_generation` calls `self.record` before its cancel loop (skp.rs, `SessionInvalidator::end_generation`). A `redeem` that the cancel refused runs after the cancel releases the `StreamRegistry` mutex, so the record is visible to the re-read.
- `ticket_liveness`'s new product-caller paragraph names `liveness_refusal`, `create_from_ticket` and `redeem_or_liveness_refusal`, which are its actual callers.
- START's `factory.create` arm and `TERM_PRODUCER_FAILED` are in `protocol/data-plane/src/server.rs`.
- The seam matches what the shell really has: `isSessionEndedTerminal` accepts both `<code>: ` prefixes (`frontends/shell/src/streaming/liveTicketSet.ts`). The doc also corrects base's stale `isSourceChangedTerminal`.

**6. The worker's off-scope notes: leave them in this piece; one item is owed separately.**
- The `engine/ADMISSION-PREREGISTRATION.md:742-744` cite in `ticket_liveness`'s doc is accurate: those lines are the fabricated-refusal text in an append-only form. It needs no change.
- `SkpHost::generations`'s doc is stale on two points. Its `frontends/shell/src-tauri/src/lib.rs:373-377` / `:376` cite now lands on origin derivation, and the call is at `:402`. The worker missed a second stale reference in the same doc: the bare `:689` for `SkpHost::new`, which sits at skp.rs:983 at 616f20d and was already wrong at base.
- Both predate this diff and lie outside §2c. Fixing them here would add scope, which would need its class-9 amendment before any code (Round 25, item 2).

**Non-blocking**
- **N1.** §8 item 1's "a caller other than `create_from_ticket`" contradicts §2b, which has `redeem_or_liveness_refusal` call `liveness_refusal`, and §4, where the tests call both steps. I read it as §2a's "only product caller" with §2b's composed call inside it. The closing amendment should cite that reading by section and item.
- **N2.** §2c scopes the line-cite replacement to "that doc block" (`create_from_ticket`'s). At base those cites were in a `//` comment in the function body, and B moved them into `liveness_refusal`. Replacing them there is the same text, so it is in scope; the closing record should say where they now sit.
- **N3.** ADR-035 D2 still names "`create_from_ticket`'s dead-ticket arm". It resolves through the composition, since `create_from_ticket` calls `liveness_refusal`, so no amendment is needed; the form amends nothing.
- **N4.** The worker report's line numbers are unpinned working pointers, so the closing record must not reuse them bare. Examples are R1 at skp.rs:3746 at add5ef8 and skp.rs:3748 at 616f20d. Under §8 item 11 and Round 25, item 2, a test-text span on this unmerged branch is named by test name with its commit id, never pinned by hash at a branch commit. The mutation rows are correctly observations at 616f20d, and the report does not call any `verify-mutation` run an observation.
- **N5.** Worth queuing: a separate class-3 item for the two stale cites in `SkpHost::generations`'s doc (item 6).

Files read:
- C:/dev/wt/ticket-liveness-redeem/kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md
- C:/dev/wt/ticket-liveness-redeem/kernel/src/lib.rs
- C:/dev/wt/ticket-liveness-redeem/kernel/src/skp.rs
- C:/dev/wt/ticket-liveness-redeem/docs/adr/ADR-035-dataset-session-ended-control-plane-event.md
- C:/dev/spatial-ide/state/consults/2026-09-30-ticket-liveness-redeem-worker-report-1.md
- C:/dev/spatial-ide/kernel/src/lib.rs and C:/dev/spatial-ide/kernel/src/skp.rs, as the base
