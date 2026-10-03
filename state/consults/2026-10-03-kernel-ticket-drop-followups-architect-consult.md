*Custodian's filing note (2026-10-03): the architect's bounded consult for node 9 (`kernel-ticket-drop-followups`) on lead-data's draft questions Q1 to Q3. It is not a gate. The architect has no write tool, so it returned this as its final message, ending "sha256: not computed" (C3). The custodian saved it byte-identical, with the harness's indentation removed. The hash of record of the text as saved, from this file's line 5 to the end, is 0fbc1e91fec32c7694ccb0c749bb766f69ef232c8a09aaa901a1638c6bd4ca19. The write audit passed: no write-capable call. The C3 check passed: the custodian checkout and refs are unchanged across the consult, apart from other agents' report files at their own brief paths.*

---

**Verdict: consult answered (not a gate)** · main @ 8715ad1b (working tree; the lead-data draft is untracked, and its pins are at c9f41126). I read the code in the working tree. Nothing in this consult may be cited as Authority, because it reads an untracked draft (round 14).

**Q2: the windows are acceptable as disclosed residuals, and the widening needs no human ruling. The draft's residual list is incomplete, though, and must be fixed before the form is committed.**

- **Closing the windows is not required.** At c9f41126, every call that can panic inside the windows is std's. Allocation failure there aborts and does not unwind. The rest are capacity-overflow panics, which no realistic input reaches and no test can trigger. Neither window is worse than the c9f41126 code. Closing them would add code to `redeem` and `mint` with no test that can reach it, which is weak against the caller rule.
- **No altered guarantee needing the human.** This is an internal invariant (#116 S1, entry 132), and the piece makes it stronger. No docs/01 or ADR guarantee changes. Nothing changes that a user of the shipped build can see. The "a guarantee changes" escalation in AI_DEVELOPMENT.md Amendment 1 §B does not trigger. AUTONOMY §21a's stated-invariant bullet calls for full two-agent gating, and the draft already chooses it.
- **Condition 1: the list of windows is incomplete.** At least two more places hold an `EngineSource`-owning value in flight under the guard, inside a std call that can panic:
  - `sweep_locked`'s `filter_map(..).collect()`. The partly built `Vec` and the removed value it is holding drop inside `sweep_locked`'s own frame while the caller's guard is still alive. They are not yet in `swept`.
  - `cancel_all_for_dataset`'s `retired.push(mem::replace(..))`. The argument drops if `push`'s growth panics.

  As drafted, §2.1 and §2.6 (a) would trip the draft's own falsifier F1 at the gate.
- **The fix is to scope the unwind half by where the panic starts, not by listing windows.** The unwind half then covers an unwind out of `SourceCancel::cancel`, the only call made under the guard through a trait object, and out of `StreamHandle::mint`, where `source` is still a parameter. "Not covered" then names any unwind out of a std call while such a value is in flight, with the four known sites as examples. This reduces the claim to what T1 to T3 prove (round 15, item b).
- **Condition 2: the qualifier belongs in the headline.** §2.1's bold first sentence must carry the qualifier itself. At present it claims "on an unwind" without limit, and the exception only arrives in the comment's last sentence. Block-on-sight item 9 then reads against the headline.
- **Minor wording fix.** "Each method declares `swept`, `retired` and `prev`" should say each method declares those of them it uses. `sweep_expired` has no `prev`, and `mint` and `redeem` have no `retired`.

**Q3: not crossing.**

- **Never-block (docs/01 principle 7, derived rule 1).** The behaviour at c9f41126 is a hang with the registry lock held, after which every later ticket call blocks. That hang is itself the violation of never-block. Replacing it with a propagated panic and recovery of the poisoned lock moves toward conformance. The abort in §2.6 (b) terminates the process. It does not block it.
- **ADR-018 Decision 1.** `cancel_requested` is when the cancel call returns to its caller. On every path that does not panic, that instant does not move, because the return-path drop order is unchanged.
- **C2.** The difference cannot be reached in the shipped build:
  - At 8715ad1b, the only product `SourceCancel` is `EngineCancel` in `kernel/src/lib.rs`. `CancelToken::cancel_inner` uses `Builder::spawn` and recovers its own poisoned lock, so it is written not to panic.
  - `mint`, which takes the `cancel` argument, is called only from inside `kernel/`.
  - The `SourceCancel` implementations under `protocol/data-plane/tests/` feed that crate's own, different `StreamRegistry`.
  - No other module can put a panicking `SourceCancel` into this registry, and no SKP response, refusal code, describe field, or bundle or wire semantics encodes a hang, a panic or an abort.

  So node 9 needs no impact read from lead-data, and the architect does not need to redraft it.
- **Condition: say so in the form.** §1, or §2's C2 paragraph, must state that the only shipped `SourceCancel` for this registry is kernel-internal and written not to panic. That is the reason the change is not crossing.
- **Optional, not required.** In the `Redeemed` arms, setting `*cancelled = true` before calling `cancel.cancel()` would remove the double-panic abort in §2.6 (b). If adopted, it must be in the form before any code: it is scope beyond the PLAN summary.

**Q1: agree.** No architect drafted text is filed at c9f41126. §2.1 stands as the draft's own text, and §0 discloses that. Its bullet on `redeem` agrees with the finding as the brief reports it: the removed value moves into `result`, which is returned after `drop(tickets)`. The form must not present §2.1 as the architect's text.

sha256: not computed
