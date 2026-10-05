*Custodian's filing note (2026-10-05): PR #178's gate 2, the architect, a scoped re-gate under `AUTONOMY.md` §22 of the fix commit bff3e21d after correction round 1 of 2, for PLAN node `b1-engine-kernel-half-followups`, under the tag node:b1-engine-kernel-half-followups@g2. Reviewed: cut/b1-engine-kernel-half-followups @ bff3e21def3d57a238a87d305eae3e3fff094856 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is d8373460ca1804bac2d8afa17fcb78035bf38464f64e0f1541b2a61e6d3f34b5. Write audit PASS: zero write calls (Read 2, Grep 1, SubagentHandback 1). Run window from the transcript: 2026-10-05T18:16:37.313Z to 2026-10-05T18:16:58.874Z. The architect read the read-only export `C:/dev/wt/b1f-head-bff3e21d`. Profile paths redacted at filing: none.*

---

Reviewed: cut/b1-engine-kernel-half-followups @ bff3e21def3d57a238a87d305eae3e3fff094856

**Verdict: PASS.** The fix resolves S1-1 as I asked. It stays within §2 and §7 and needs no amendment. My closing-record list does not change.

Scope: only the fix commit bff3e21d. I read `C:/dev/wt/b1f-head-bff3e21d/kernel/tests/skp_projection.rs` in the read-only export. I made no writes and ran no shell. The diff facts (one line changed, nothing else) and the assertion at b438c587 are the reviewer's to confirm, as the brief says.

## Findings

**S1-1 (gate 1): resolved.**
- The clause in the Observed part now reads `(the same test whose closing `codes.len() == 8` assertion is K-4's own claim). Reverted.` (byte-copied from `kernel/tests/skp_projection.rs:373 @ bff3e21d`).
- At the head it is true. The test's closing assertion is `assert_eq!(codes.len(), 8, …)` at `kernel/tests/skp_projection.rs:571-575 @ bff3e21d`.
- The comment's own stamp at `:368` still names b438c58728d044e67466c438b35091f813e57be2, so the clause is now read at that commit. At gate 1 I found the 8-member closing assertion already present when the stamp was written (`:571-575 @ 7b05dfd6`, and the doc's 7-to-8 note at `:358-359`). That supports the clause being true at b438c587 as well. The reviewer's check of b438c587 is the proof.
- The mutation text (`:368-370`) and the observed message (`:371-372`) are unchanged in what I read. Only the number in the clause changed.

**Within §2 / §7, no amendment: yes.**
- The change is comment-only. It sits on row K-3, which §2 already lists, so it is not class 9.
- The line count of `skp_projection.rs` does not move (one line replaced), so it is not class 8. §7 is untouched.
- No pub item, assertion, message, fixture or name changes, so §8 items 1 to 3 still hold for this commit.

**N-1. Historical "7" at `:358` is correct, and it stays.** The doc's `(12.2's closing note: the closing `codes.len() == 7` assertion becomes 8)` (byte-copied from `kernel/tests/skp_projection.rs:358-359 @ bff3e21d`) records the 7-to-8 change. It does not claim the current value. This is not a stale cite.

## Round 25 checks for the fix commit
- Class 8 and class 9: none, as above.
- No record calls a `verify-mutation` run an observation.
- No test-text span is pinned at a branch commit.
- The five-line-form check does not apply.

## Closing-record list
No change to the gate-1 list. Two items are now filled:
- Item 1's "reviewed head after the S1-1 fix" is bff3e21def3d57a238a87d305eae3e3fff094856.
- Item 2 adds this report, `state/consults/gates/2026-10-05-b1-engine-kernel-half-followups-gate2-architect.md`, and the reviewer's gate-2 report if one is filed.
- This is correction round 1 of 2 for the piece.

Files:
- C:/dev/wt/b1f-head-bff3e21d/kernel/tests/skp_projection.rs
- C:/dev/spatial-ide/state/consults/gates/2026-10-05-b1-engine-kernel-half-followups-gate1-architect.md
