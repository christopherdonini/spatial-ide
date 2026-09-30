*Custodian's filing note (2026-09-30): the architect's gate 1 on PR #149, for PLAN node `publish-refusal-codes-and-attempt-lifecycle` at g1, the second piece (the A4-1 and A4-3 src-tauri lines), full gating. Reviewed: cut/publish-refusal-src-tauri @ a633b02 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 19:36:17Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at a633b02. Item 1 accepts the form's commit as its branch's first commit; its record needs (a) is met by PR #149's body, (b) by a merge commit, and (c) is owed by node 3's done commit. N1 is answered by the gate-1 reviewer's checks 4 and 7 (verify-cites, verify-test-claims and verify.mjs rc=0; Governance CI ran on the PR head a633b02 and passed). Profile paths redacted at filing: none.*

---

Reviewed: cut/publish-refusal-src-tauri @ a633b02

**Verdict: pass with notes.** Nothing blocks.

Limits of this review: I had no Bash. I compared the worktree at a633b02 with main's `publish.rs`, which is unchanged since 0f98934. The file list relies on the custodian's numstat in the filing note of `state/consults/2026-09-30-publish-refusal-src-tauri-worker-report-1.md`. The reviewer should recompute the form's span hashes, including the one on `protocol/skp/SKP-V0.md:750-758`.

**1. Committing the form as the branch's first commit: PASS.**
- The rule is only "committed before any code" (`docs/PREREGISTRATION-TEMPLATE.md:27`), and 4a2bb00 comes before 55ce85e, the first code.
- The custodian's reasoning is right. `plannedGateNotes`/`plannedGateFiles` (`scripts/plan/verify-test-claims.mjs:683-710`) exempt only the `gate` of a non-done node. `PLAN.yaml` node 3 names `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`. So this form on main before its code would have turned main red on T1 and T2.
- After the merge, T1 and T2 exist, so the form's claims bind and pass.
- What the record needs:
  - (a) The PR #149 body names the form, the form commit 4a2bb00, and the fact that PLAN's `gate` holds the first piece's form.
  - (b) The before-code proof is the branch's commit order. A squash merge leaves 4a2bb00 off main, so an append-only record cannot pin it (round 15, item (e)). So either merge with a merge commit, or the closing record names the order by PR #149's commit list and not by a hash pin.
  - (c) Node 3's done commit names both forms in its summary or entries, because `gate` holds one path.

**2. §2 items 1–3 as written, nothing else: PASS.**
- Execute arm at `frontends/shell/src-tauri/src/publish.rs:737` @ a633b02: ahead of the catch-all, which keeps `e.to_string()`.
- Pin-phase arm at `:1078`: through the existing `publish` import. It sits after the `Cancelled` arm, so `From<EngineError>` (`kernel/src/publish/error.rs:363-371`) can only produce `Engine(_)` there. The §5 falsification about a code other than `publish.engine` cannot occur.
- §8 item 1: the two §7 files only (relied on).
- §8 item 2: no new code, variant or string. The prefix comes only from `refusal_detail`.
- §8 item 3: `Permission`/`Audit` stay on the catch-all. The CSPRNG and viewer strings are untouched.
- §8 item 4: the outcome enums, the `OutcomeNotAudited` arm (`:729`), the `Cancelled` arm (`:1076`) and `ensure_pinned` (`:1041-1047`) are byte-unchanged.
- §8 item 5: no `pub` item added.
- §8 item 7: no `cfg`, ignore or OS-keyed logic.
- Caller rule: both arms sit on product paths (`commands.rs:349`, `:409`, `:526`).

**3. Round 32 G1 (a) and G3 (a); SKP-V0; comments: PASS.**
- The two arms are what the human ruled, as the arms the question put to them (`state/questions/round-32.md` G1 (a), G3 (a)).
- SKP-V0 750-758 stays true without an edit. "A publish refusal reaching the shell is `"<code>: <display>"`" is now true at execute and at the pin phase as well. "Applied at **both** … preflight sites" is still true, because it says "both", not "only".
- The site comments (`:735-736`, `:1077`) are true.
- The module doc (`:29-31`) is true: publish refusals typed, permission, audit and other refusals plain.

**4. T1–T4, the seam rule, §8 item 8: PASS.**
- T1 (`:2234`) asserts F1's equality and the absent `out-cancelled`, and F1c's lack of a `publish.` prefix, as §4 says.
- T2 (`:2271`) re-derives the engine Display at run time. It asserts the prefix, the equality, no nested `publish.`, no pin, and `store.len()==0`.
- T3 (`PublishPanel.test.ts:169`) and T4 (`:117`) feed the byte-captured strings to the real `nextStateFromDialogSettled` and `nextStateFromPrepareOutcome`. Both go through `formatPublishRefusal` (`PublishPanel.tsx:231`, `:272`). The wire enum shape (`#[serde(tag = "status")]`) is unchanged, so the real shape is proved end to end.
- P0 was observed at 55ce85e: both tests failed by name at base, and the invalid-run condition did not fire.
- M1–M4 were applied, run and reverted at a633b02. The report states that none was a `verify-mutation` run.
- T4's literal is labelled "byte-captured on Windows (its OS text is Windows')". No assertion reads the OS text; it asserts the code and `startsWith("publish.")===false` (R1, R4).

**5. §2 item 5, R1–R6: PASS.**
- R1: `refusal_detail` is formatting only, and T2 does not match OS text.
- R2: not engaged. There is no `cfg`, and `kernel/src/publish/error.rs` is untouched.
- R3: not engaged. Nothing in the piece depends on the OS.
- R4: no drive letter, backslash or `LOCALAPPDATA` in product code. T4's capture is labelled. F2's `remove_file` succeeded on Windows.
- R5: the claim is Windows L1 only, as §1 states.
- R6: no ignore added.

**6. §9 operator line: PASS.**
- The label reaches `RefusalBlock.tsx:28` unchanged in path. `refusalGuidance` has an arm only for `publish.geographic_crs_not_publishable` (`formatRefusal.ts:118`), which round-32 G1's text disclosed.
- G4 (`MANUAL-WALKTHROUGH.md:327`) is a wrong-phrase `PermissionError` on the catch-all, so it still reads `publish-refused` and stays true.
- No walkthrough row or `e2e/*.mjs` matches the unprefixed execute or pin text: I grepped for it, and `e2e/publish.mjs:424` checks `status` only. The §5 Stop invalidator did not fire.

**Blocking:** none.

**Non-blocking:**
- **N1 (before merge):** two of the suites §9 names, `verify:cites` and `verify:plan`, are not in the worker's CHECKS. Governance CI ran only at 4a2bb00 (red, the known case) and not at the head. Run both, and `verify:test-claims`, at a633b02 and record the exit codes before merge.
- **N2:** the module doc writes the shape as `publish.<code>: <Display>`. `code()` already returns `publish.x` (`error.rs:184-218`), so this can be read as a doubled prefix. SKP-V0 writes `"<code>: <display>"`. A future edit could align the two; it is not false as written.
- **N3:** §7's count is to be run from `<base>`, but the report ran it from 4a2bb00. The two counts are the same, because the pathspec excludes the form: 120 of 170, 2 files.
- **N4:** T4's label says "this branch's fix commit", and T3's comment says "fix commit", neither by id. The worker's report names cc9c9a1, which suffices for the record. The test comment will not resolve after a squash merge. Not a round 25 item 2 failure, because the comment is test text and not a record.

Files:
- C:/dev/wt/publish-refusal-src-tauri/frontends/shell/PUBLISH-REFUSAL-CODE-SRC-TAURI-PREREGISTRATION.md
- C:/dev/wt/publish-refusal-src-tauri/frontends/shell/src-tauri/src/publish.rs
- C:/dev/wt/publish-refusal-src-tauri/frontends/shell/src/publish/PublishPanel.test.ts
- C:/dev/spatial-ide/scripts/plan/verify-test-claims.mjs
- C:/dev/spatial-ide/state/consults/2026-09-30-publish-refusal-src-tauri-worker-report-1.md
