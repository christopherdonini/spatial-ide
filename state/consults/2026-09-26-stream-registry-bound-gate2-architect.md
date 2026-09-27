*Custodian's filing note (2026-09-26): the architect gate's attempt-2 report (a scoped record round) for PLAN node `data-plane-stream-registry-bound`, reviewed at cut/data-plane-stream-registry-bound @ a4aa7f3, filed as returned (extracted by script from the agent's hand-back; byte-identical). Everything below the rule is the agent's text.*

---

**Verdict: PASS with notes. `cut/data-plane-stream-registry-bound` @ `a4aa7f3`.** Record round 1 of 2 closes, and no further round is owed.

## Findings (none blocking)

**My attempt-1 B1 is resolved.** Amendment 2 row 1 names the tool behind Amendment 1 row 5's fmt claim, as round 15 (c) requires: rustfmt 1.9.0-stable (8bab26f4f6 2026-07-14), the custodian's runs, at `522493a` and `e061cb1`.
- The reviewer's reproduction under that rustfmt is the proof: `state/consults/2026-09-26-stream-registry-bound-gate1-reviewer.md:68-70`.

**The reviewer's B1 is resolved by `8ed5228`.** The five excerpt headers now state their line-number basis:
- T1–T3: `C:\dev\wt\stream-registry-bound\protocol\data-plane\tests\stream_registry_bound.rs:201`, `:238` and `:292`, "this file's at 2b99551, before these records". That is accurate, because their mutations were in `server.rs` and `adapter_ws.rs`, so the test file was not mutated.
- T4 and T5: `C:\dev\wt\stream-registry-bound\protocol\data-plane\src\server.rs:625` and `:680`, "the mutated tree's, not 2b99551's". That is accurate per the reviewer's resolution at `2b99551`.
- The line numbers are unchanged (201, 238, 292, 625, 680), so the change holds line counts. The reviewer confirms that `8ed5228` touches only those five lines and that `a4aa7f3` is append-only.

**Notes:**
- **Amendment 2's "Superseded: nothing".** It is acceptable, because `8ed5228` only adds a qualifier; nothing is withdrawn.
  - The class-3 test-text exception asks for the superseded span to be pinned. Here that span is `8ed5228`'s parent's bytes of the five lines. That is the form `scripts/plan/TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md:209` used, and round 15 (e) forbids a hash pin at a branch commit.
  - No fix.
- **Row 4 (my attempt-1 N1).** Class 2 rests on the precedent of round 23, item 4, O7, which was ruled for that form, pending #129's class 8. Row 4 carries no reason. This goes into the PR body, as you said.

## Ruling on the reviewer's S1: no fmt pass is owed in this piece

1. **§9's fmt line cannot be met inside the form's own bounds.**
   - `cargo fmt --check` over the crate is red on main under rustfmt 1.9.0: seven files, per reviewer:69.
   - Five of those seven are outside §7's file ceiling (`adapter_ws`, `session`, `transport`, `wire`, `no_transport_leakage`).
   - `candidate_a.rs` is an existing test, and §8 item 13 forbids editing one.
   - So a green crate would take edits that §8 items 11 and 13 block on sight. §8 binds the piece, and §9's line assumed a CI premise that was false. That was my drafting defect, attempt-1 N4.
2. **The record does not discharge §9, and it does not claim to.**
   - Amendment 1 row 5 and Amendment 2 row 1 record a red suite with its tool, its baseline and CI's absence. That is everything a gate can verify.
   - No "discharged" clause exists, and none should be added.
3. **Formatting only the piece's own new hunks is not required here.**
   - Those hunks are the six in `stream_registry_bound.rs`, plus the new ones in `prune_locked`, `snapshot`, the `pump::spawn` `Err` arm and T5, per reviewer:120.
   - Formatting them would be a code change after the closing record. It would falsify row 4's final figure, since 570 would move, and would force a second record round, all for a style debt that main already carries and CI does not gate.
   - A partial pass inside `server.rs` would also leave the file mixed: rustfmt 1.9.0 also rewrites lines that were already there.
4. **Where the debt goes: the ledger, as a proposal for the human.** One mechanical piece that runs `cargo fmt` on the whole crate, with no behaviour change, and, if the human wants it, adds an fmt step to `product-ci-rust.yml`.
   - The CI step is a policy change, so it is the human's to decide, not this piece's.
   - The PR body should say plainly that this piece adds rustfmt hunks, knowingly and with the reason recorded.

## Gate-log line

`data-plane-stream-registry-bound attempt 2 @ a4aa7f3 — architect PASS with notes (record round 1 of 2 closes): Amendment 2 row 1 names rustfmt 1.9.0-stable (8bab26f4f6) and the custodian's runs (round 15 (c), attempt-1 B1 resolved; reviewer:68-70 reproduces); 8ed5228's five qualified excerpt headers are accurate and hold line counts (reviewer B1 resolved); "Superseded: nothing" accepted, the change adds a qualifier only, span = 8ed5228's parent; S1 ruled: no fmt pass owed — §9's fmt line cannot be met without tripping §8 items 11/13, the record states the red with its tool and baseline, crate-wide fmt (+ optional CI fmt step) goes to the ledger as a proposal to the human; row 4's O7 precedent goes in the PR body.`

Files:
- `C:\dev\wt\stream-registry-bound\protocol\data-plane\STREAM-REGISTRY-BOUND-PREREGISTRATION.md`
- `C:\dev\wt\stream-registry-bound\protocol\data-plane\src\server.rs`
- `C:\dev\wt\stream-registry-bound\protocol\data-plane\tests\stream_registry_bound.rs`
- `C:\dev\spatial-ide\state\consults\2026-09-26-stream-registry-bound-gate1-reviewer.md`
