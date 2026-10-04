*Custodian's filing note (2026-10-04): PR #170's gate 2b, the architect, for PLAN node `type-walk-null-literal-arithmetic`, under the tag node:type-walk-null-literal-arithmetic@g4, scoped to the change since gate 2 (3074e9a0 to 1484b5ba, one comment line). Reviewed: cut/type-walk-null-literal-arithmetic @ 1484b5bac9e29d6a7b47331f1cbd157864d10eb5 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It arrived as a message and is extracted here mechanically from the session transcript's copy of the hand-back, with the harness's two-space indent removed. Its sha256, from this file's line 5 to the end, is a5e6cd6e39318da6d281903c561a9103eb6bfa8b534178b7ad24e28e1772d6d3. Write audit PASS: zero write calls (Read 3, Grep 4, Glob 1, the hand-back 1). C3: the worktree is at 1484b5ba with an empty porcelain before (12:26:00Z) and after (12:27:24Z); the main checkout's untracked files are the custodian's own filings in progress and the human's audit file. Profile paths redacted at filing: none.*

---

Reviewed: cut/type-walk-null-literal-arithmetic @ 1484b5bac9e29d6a7b47331f1cbd157864d10eb5

# Gate 2b, architect: type-walk-null-literal-arithmetic (PR #170, node 10), scoped to 3074e9a0..1484b5ba

**Verdict: PASS.** There is no S1 and no S2. I have two N findings, and neither blocks.

**How I read it.** I read `C:/dev/wt/null-literal/engine/tests/filter_type_admission.rs` lines 400-439 in the worktree, which the custodian says is at the head. I also read my gate-2 report and the gate-2 reviewer's S1-1, and Grep'd the form's §8 items 13 and 19 (`engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md:297` and `:303`, read in the worktree). I have no Bash, so I have not confirmed the worktree's HEAD, the one-file stat, or that no other file changed. Those are the reviewer's to re-show. Everything below is my paraphrase except the one marked byte-copy.

## The change against N1 and S1-1

Byte-copied, `engine/tests/filter_type_admission.rs:418` @ 1484b5ba (a branch commit, named by its id, with no hash, per §8 item 19):

```text
        // H-4's class-2 result, observed at DuckDB v1.5.5 at commit 8efcde98: the surrogate prepare refuses
```

- **§8 item 13: disposed.** The comment now names DuckDB v1.5.5 for the binder refusal it states at :418-421. That matches the other version-naming DuckDB statements in the file (:393, :994), Amendment 3's result, and the version the gate-2 reviewer observed it at. The reviewer's S1-1 asked for this remedy, and it is now done.
- **The unnamed "this commit": disposed.** The observation is now dated to 8efcde98, the code commit that Amendment 3 and worker report 3 name. It no longer means whatever commit later carries the line.
- **§8 item 19: holds.** 8efcde98 is named by commit id in a source comment. It is not a hash pin of test text, so a branch commit is allowed here. Round 15(e) does not apply, because this is not a hash reference in an append-only record.
- **My gate-2 N1 is closed** by this line.

## The rest of the gate-2 PASS

The change is one comment line (going by the custodian's diff). It moves no prediction, outcome, code path, `pub` item, cfg, reason, wire value or Display. So §8 items 1-12 and 14-21, the §2.1/§2.4/§2.9 readings, Amendment 3, the seams, the caller rule and the gate-1 dispositions all stand as I recorded them at 3074e9a0.
- The budget changes by at most 0: one line is replaced by one line. The reviewer recounts it with §7's command.
- My gate-2 N2-N4 stand unchanged.
- The test file's B-T3 entries at :404-439 are as they were at gate 2, and C48's fifth entry still predicts `skp.filter_rejected_by_binder` (:422-426).

## Findings

- **N1. Line :418 is now 108 columns, past rustfmt's default 100.** The worktree has no `rustfmt.toml`, so `error_on_line_overflow` is off and rustfmt does not reflow comments (the same fact round 15 (d) relies on). So `cargo fmt --check` should stay green. The reviewer confirms it from CI at the head. No action.
- **N2. The comment's commit reference depends on gate-2 closing-list item 1 (merge commit, never squash).** 8efcde98 is a branch commit, and a squash would leave the source comment naming an unreachable commit. The merge commit already required by the header's Branch line and §2.7 covers this. No new action.

## Closing-record list (carried from gate 2, plus this scope)

1. Merge as a merge commit, never a squash, so that 8efcde98 stays reachable. This now also covers :418.
2. The reviewer re-shows `git diff --stat 3074e9a0 1484b5ba` as one file with 1 insertion and 1 deletion, and the worktree HEAD as 1484b5ba.
3. Gate-2 closing items 2-6 stand as filed. Any closing amendment is references and hashes only (the record cap).

Files read:
- `C:/dev/wt/null-literal/engine/tests/filter_type_admission.rs` (lines 400-439; Grep for v1.5.5 / 8efcde98)
- `C:/dev/wt/null-literal/engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md` (Grep, §8 items 13 and 19)
- `C:/dev/spatial-ide/state/consults/gates/2026-10-04-type-walk-null-literal-arithmetic-gate2-architect.md`
- `C:/dev/spatial-ide/state/consults/gates/2026-10-04-type-walk-null-literal-arithmetic-gate2-reviewer.md` (S1-1 and §8 rows, by Read and Grep)
- Glob for a rustfmt config in `C:/dev/wt/null-literal` (none found)

Write audit: I used only Read, Grep, Glob and this hand-back, and made no write-capable call.
