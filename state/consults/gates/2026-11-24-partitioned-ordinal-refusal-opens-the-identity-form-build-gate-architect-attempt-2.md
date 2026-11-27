Reviewed: branch cut/partitioned-ordinal-refusal-opens-the-identity-form at 78a36aaad6f93c501f4a3dd95d03d17798d4b158, PR 366 (draft), in the branch worktree C:/dev/wt/partref, read only; the records at main 726dd41a12888aee3bbd8b960b1a1521378be4f3 in C:/dev/wt/read-1124a (the custodian's filing note, 2026-11-24: the architect's build gate (narrow re-gate), attempt 2, node:partitioned-ordinal-refusal-opens-the-identity-form@build-gate-architect-2, dispatched at 2026-11-24T01:26:26Z; its run: Read 10, Grep 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T01:26:27Z to 2026-11-24T01:28:04Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T01:28:04Z. Filed below the rule from its hand-back, 7322 bytes, sha256 68244a88ac25b60fa0070afa2f4517419dc4f629c473e68ac979f87ac2d3aa7d, byte for byte, nothing masked; 1 path of a file not on main, cited with a line, written as the file name alone by the custodian: `kernel/tests/partitioned_refusal_offers_no_declaration.rs` to `partitioned_refusal_offers_no_declaration.rs`, with one final newline added.)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/partref @ 78a36aaad6f93c501f4a3dd95d03d17798d4b158
Branch: cut/partitioned-ordinal-refusal-opens-the-identity-form @ 78a36aaad6f93c501f4a3dd95d03d17798d4b158
REPORT PATH: state/consults/gates/2026-11-24-partitioned-ordinal-refusal-opens-the-identity-form-build-gate-architect-attempt-2.md

E1 is closed. D-1 is applied exactly. There is one new Documentation finding, D-2, which must be fixed before the merge. It causes no re-gate.

## 1. E1: closed (Evidence)

What the log (`<S>/pmk-k1-mut.log`) shows, against §4 row K1 and my attempt 1's prediction:
- **The test's name.** `a_folder_opened_with_or_without_a_declared_identity_is_refused_by_name_and_offered_no_declaration ... FAILED` (log :7, :21). This is §4's K1 name.
- **Assertion (a) on the declared open.** The panic is at `kernel\tests\partitioned_refusal_offers_no_declaration.rs:75:5`, which is `assert_eq!` failing, left `"engine.source"` and right `CODE` (log :13-16).
  - At 8d1fe83a the six doc lines did not yet exist. So line 75 there is head :81 minus 6, which is `assert_eq!(declared.code, CODE, ...)`, starting at column 5. That is (a) for the declared open.
  - The undeclared assertion one line above it passed. So only the declared open got past the gate, which is the behaviour a `declared_identity.is_none()` guard gives.
  - The 75:5 layout also backs the claim that the run was at 8d1fe83a: at the head, :75 is `}),`.
- **The code seen.** `engine.source`, with the message "source: …/parts is not a readable file". That is the fall-through to `engine/src/dataset.rs:330-335` (head). This is what §4 ("K1 fails at (a) for the declared open (`engine.source`)") and attempt 1 E1 predicted.
- **The exit code.** The log has no exit code. Its last line is cargo's `error: test failed` (log :25), which cargo prints only on a non-zero exit. The "exit 101" comes from the worker's report and is read as a claim.
- **The mutated line.** The log shows the build (spatial-engine recompiled, log :1), not the source. The worker's report claims a replace count of 1 at the gate, and the sha256 `bf392807…` equal before and after. I read both as claims.
  - What is proven: the observed behaviour is the one the §4 guard at `dataset.rs:327` produces.
  - Also proven: `engine/src/dataset.rs` is not in 8d1fe83a..78a36aaa, so no mutation was committed. The gate at head :327-329 is the unmutated code.
- **The control.** `<S>/pmk-k1-head.log`: K1 unmutated, `1 passed; 0 failed`.

The RECORDED MUTATION paragraph (head :33-37), checked clause by clause:
- "observed at `8d1fe83a…`": a claim, backed by the 75:5 layout above. It is a branch commit named by its id, as round 25 asks.
- "the partitioned gate … guarded with `declared_identity.is_none()`": the worker's claim. The behaviour in the log is consistent with it.
- "so a declared open gets past it": the log shows this.
- "fails by name at (a) … the code assertion on the declared open, which saw `engine.source`": the log shows this.
- "line 75": true at 8d1fe83a and false at the head. See D-2.
- "Applied, run, reverted; the file's sha256 matched":
  - "run" is in the log;
  - "reverted" is shown by the diff and the clean tree;
  - "sha256 matched" is the worker's claim, in the same form as the existing paragraph's "`cmp` passed".

The worker's report correctly does not call the `verify-mutation` run an observation (round 25).

## 2. D-1: applied
- Head `formatRefusal.ts:124-132` is my attempt 1 D-1 New text, line for line.
- The Old text is gone (diff lines 9-11 and 20 removed).
- The only hunk in that file is D-1's.

## 3. The rest
- **Two files only.** `formatRefusal.ts` (a comment only) and K1 (doc lines only). The commit adds no assertion and changes no logic.
- **§7.**
  - This commit is 13 insertions and 4 deletions.
  - From the base's view, the four removed lines were this piece's own insertions: the comment cites this form's section 0 and was written by this piece. So the count against 2095a7ac grows by 3 net in `formatRefusal.ts`, and by 6 in K1. 183 + 9 = 192, which matches the worker's numstat. K1 at the head is 99 lines, which matches its `99+0`.
  - Even if those four lines were base lines, the count would be 183 + 17 = 200, still at the ceiling and not over it.
  - Five files. No class 8.

## Finding

**D-2. Documentation (must fix before the merge). A bare self-line in a file this same commit edits.**
- The place: `partitioned_refusal_offers_no_declaration.rs:35-37` at 78a36aaa.
- The defect: "line 75" was written by the commit that inserted six lines above it. At the head, :75 is `}),`, and the assertion is at :81. Round 14 forbids a bare line into a file the same commit edits, and a pin read as current.
- Whose words: the worker's, not the human's. The worker applies the words below with no re-gate, and the PR body lists them. The §7 count is unchanged: three lines replaced by three, still 192.

Old:
```text
/// a declared open gets past it. Observed outcome: this test fails by name at (a), line 75, the
/// code assertion on the declared open, which saw `engine.source`. Applied, run, reverted; the
/// file's sha256 matched.
```
New:
```text
/// a declared open gets past it. Observed outcome: this test fails by name at (a), the code
/// assertion on the declared open (`declared.code`), which saw `engine.source`. Applied, run,
/// reverted; the file's sha256 matched.
```
Each clause checked against the code at the head:
- "`declared.code`" is the assertion at head :81, `assert_eq!(declared.code, CODE, ...)`, under the "(a)" comment at :79.
- "saw `engine.source`" is in log :15.
- The rest is unchanged. Each line is within 100 columns.

## What the closing amendment must record of this close
- This re-gate: PASS WITH NOTES, at the REPORT PATH above. Attempt 1 was FAIL.
- E1 closed by M-K1b observed at 8d1fe83acfaede6873b6366e6594b99ddf9943ad: K1 fails by name at (a) on the declared open, with left `engine.source`.
  - The run log is evidence (a run's output), not Authority.
  - The applied replace and the sha256 are the worker's claims.
  - The paragraph is at K1's doc, by commit id.
- D-1's words (attempt 1) and D-2's words (this report) applied, both listed in the PR body.
- §7: 192 of 200 against 2095a7ac, over 5 files, at the commit that applies D-2 (named).
- `verify-mutation`, if cited at all, is named with its commit and not called an observation.
- 2b90ed51 and 8d1fe83a stay reachable on main only through a merge commit, not a squash (carried from attempt 1).

No decision is missing, so there is no ADR skeleton.

## Files read
- `<S>/brief-partref-arch-2.md`
- `<S>/report-partref-arch-1.md`
- `<S>/partref-diff-78a36aaa.txt`
- `<S>/report-partref-mk1b.md`
- `<S>/pmk-k1-mut.log`
- `<S>/pmk-k1-head.log`

In `C:/dev/wt/partref` (@ 78a36aaa):
- `kernel/tests/partitioned_refusal_offers_no_declaration.rs` (whole)
- `engine/src/dataset.rs` (:315-339)
- `frontends/shell/src/admission/formatRefusal.ts` (:110-139)

In `C:/dev/wt/read-1124a` (@ 726dd41a):
- `governance/forms/frontends/PARTITIONED-ORDINAL-REFUSAL-OPENS-THE-IDENTITY-FORM-PREREGISTRATION.md` (§4 and §7, :138-190)

`<S>` = `C:/Users/<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad`

Model: Opus 5.5 (claude-opus-5-5).
