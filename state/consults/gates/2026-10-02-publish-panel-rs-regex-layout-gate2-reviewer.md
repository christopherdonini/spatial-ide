*Custodian's filing note (2026-10-02): the reviewer's gate 2 on PR #158, for PLAN node `publish-panel-rs-regex-layout`, the single combined gate (§21b), scoped to correction round 1 (8a1b0dc..10fb48a). Reviewed: cut/publish-panel-rs-regex-layout @ 10fb48ab70cff55d985ea0bd101677d9379961e3 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at 10fb48a. Verdict PASS. Its S2-1, the PR body, is met: the body now names correction round 1 and the two class 3 rows by commit in words, and the gates. N1 (this report is the guard's observation, at 10fb48a), N2 (the mutation's failure site depends on the layout) and N3 (the superseding spans are lines 226 and 475 at b850f5e) go to the closing record. Ready for the human's click, merge commit only. Profile paths redacted at filing: none.*

---

VERDICT: PASS
Reviewed cut/publish-panel-rs-regex-layout @ 10fb48ab70cff55d985ea0bd101677d9379961e3. PR #158, gate 2, reviewer: the single gate (§21b), scoped to correction round 1, range 8a1b0dc..10fb48a (a0aae0e, b850f5e, 10fb48a).

No S1 findings. One S2 needs fixing before merge, and it is a PR-body edit only, with no code change. Gate 1's other areas carry forward: the delta touches only the two `moved` lines, the two RECORDED MUTATION comments and the two new guard lines, plus the form's three lines. The worktree is left clean (`git status --porcelain` empty), with nothing committed or pushed.

## Findings

**S1:** none.

**S2-1. The PR body is stale and does not name the class-3 rows.** The round 25 item 2 (d) rule in `docs/PREREGISTRATION-TEMPLATE.md` (section "A test-text span on an unmerged branch") says: "The piece's PR body names the row and asks for a merge that keeps the commit reachable from main, never a squash."
- The body does ask for a merge commit.
- It does not name the class-3 rows: the two RECORDED MUTATION comments, lines 226 and 474 of `frontends/shell/src/publish/PublishPanel.test.ts` at 8a1b0dc, superseded at b850f5e.
- It still reads: "Gate: reviewer, gate 1 pending"; "observed on f5c87b0 plus the change"; "Size: 14 changed lines".
- Fix: add correction round 1 (a0aae0e, b850f5e, 10fb48a, 16 lines in the Scope file), name the two rows by commit in words, and update the gate line.
- This is not on the fail-by-name list: no span is hash-pinned at a branch commit, and both spans carry their commit id.

**N1. The custodian's reading is confirmed, with one refinement.**
- The guard passing on c6d1414's file does show that the copy differs from the file on that layout. On its own, though, it does not show that the guard can fail.
- This gate observed the guard failing on the vacuous shape it exists to catch. On c6d1414's `publish.rs`, I reverted FILTER's `moved` to the old fixed-string replace. The test "FILTER_SCOPE_SENTENCE -- pinned against publish.rs's own copy > matches frontends/shell/src-tauri/src/publish.rs::FILTER_SCOPE_SENTENCE exactly, Rust line-continuation collapsed" then fails by name at `PublishPanel.test.ts:228:23` (`expected '// SPDX…' not to be '// SPDX…'`).
- On main's file the same reversion passes 42/42. That is correct: the fixed-string replace takes effect on main's layout.
- For PREPARE, a replace that matches nothing fails "prepareCancelKey … > PREPARE_CANCEL_KEY_PREFIX matches … exactly" at `:477:23` on both files.
- The worker's vacuity check was mis-designed, as you say. The regex mutation and the variant's vacuity are separate properties.
- The closing record should cite this report, by its gates/ path, as the guard's observation, naming 10fb48a.

**N2. The Tests+mutation claim depends on the file's layout, and the record should say so.** On c6d1414's layout the mutated FILTER regex cannot match the file at all, so the FILTER mutation fails earlier than on main. It fails at `expect(match).not.toBeNull()` (`:224` at 10fb48a), which is still a failure by name of the same test. The form's "fails by name on the in-memory assertion" holds as observed, on main's layout at the recorded commit. After #157 merges it describes the commit, not the tree.

**N3. The Superseded index line names the superseding spans by commit only.** It says "at b850f5e" with no lines. They are lines 226 and 475 at b850f5e. Naming them would give the closing record's hash pins a words-form antecedent on both sides.

**N4. The Amendment line cites a file that is not on the branch.** The cited path, `state/consults/gates/2026-10-02-publish-panel-rs-regex-layout-gate1-reviewer.md`, is on main (8beb601) but not on the branch, which is based on f5c87b0. It is a bare path with no `:line`, and verify-cites is green. It resolves after the merge.

## Checks

**1. S2-1 (gate 1) is closed.** I probed both files in a scratch script outside the worktree, each as LF and as a CRLF-normalised copy (all eight combinations):
- The new regex replace hits exactly once per name, the guard holds (`moved !== src`), and the in-memory capture equals the file's capture.
- On c6d1414, LF and CRLF alike, the old fixed-string FILTER replace is a no-op (guard false). The new replace is not a no-op.
- The inserted run ` \t\r\n    ` cannot coincide with a formatter's layout: it has trailing whitespace before the line break, which rustfmt strips. So the guard cannot fail falsely on any formatted file, CRLF included.
- The catch on the vacuous variant is in N1.

**2. Both mutations re-observed on 10fb48a's tree** (`=\s*"` changed to `= "`, one regex at a time, then reverted):
- FILTER: 1 failed, 41 passed. The test above fails by name at `:229:34` with "expected undefined to be 'this bundle format cannot record a ro…'".
- PREPARE: 1 failed, 41 passed. The test fails by name at `:478:34` with "expected undefined to be 'prepare:'".
- This matches the worker report and the comments. The comments' "base a0aae0e plus this change" is b850f5e's tree, and the test file is byte-identical between b850f5e and 10fb48a.

**3. Seam proof re-observed:**
- With c6d1414's `publish.rs` checked out into the tree (numstat 413/105): 42/42.
- After restoring it to HEAD (main's file): 42/42.

**4. Budget:**
- `git diff --numstat f5c87b0...10fb48a` gives `14 2` for the test file: 16 changed lines in 1 file, within the 20 declared. The form is excluded.
- The form shows `3 0`: a blank line plus the two new lines. a0aae0e added 2 (the blank and the Amendment line) and 10fb48a added 1.
- The correction alone (8a1b0dc..10fb48a) is 6/4 in the test file.

**5. The Amendment line and the Superseded index line:**
- **Order.** a0aae0e (parent 8a1b0dc) touches only the form, and it comes before b850f5e, the only code commit. So "before the correction's code" is true.
- **Content.** The replace, the guard, "Scope, budget and the mutation unchanged" and "re-observed" are all true against b850f5e (checks 1 to 3).
- **Classes.**
  - Class 1: the first line says "written after gate 1's results". It fits.
  - Class 4: gate 1 found the test the mutation targets weak, because its variant was vacuous on c6d1414. The correction is to that test, and the observed failures are recorded by name in the comments. Class 4 is the nearest fit and is acceptable.
  - Class 3: the comment's claim changed from "f5c87b0 plus this change" to "a0aae0e plus this change". That is a claim in test text, so class 3 under the round-14 test-text exception, with the round 25 item 2 (d) words form. The superseded spans are named in words with their commit (lines 226 and 474 at 8a1b0dc are the RECORDED MUTATION comments; confirmed) and no hash. That is correct for spans on an unmerged branch.
- **Record cap.** This is correction round 1 of 2, and the round ends with a superseded index (round 12 (e)). Neither line is a closing amendment. No record calls a verify-mutation run an observation.
- **Help for the closing record's later pins.** sha256 over the single LF lines, as committed:
  - 8a1b0dc:226 `ebc2fb60a10dff0c432c630880fd4fdb2a95c0972e233b4f2ac9394aa9581d17`
  - 8a1b0dc:474 `f297a4a7624e5dd3c99bb28dbc2d953e0e004219a558dceb181fb23fdc8030ea`
  - b850f5e:226 `d579de0393f4fde1f7895f8ab3d8318b99f4ea304bc1f752bba6526bdc7c9301`
  - b850f5e:475 `1895a3499249117a4f41e75cdcb3875af4a5cacc9e9ec101bb87d07fa8663f6c`
  - Recompute them once 8a1b0dc and b850f5e are on main.

**6. CI:**
- `gh pr checks 158` gave rc 8 at first read (product jobs pending). I waited with a bounded `gh pr checks --watch` from 16:09:00Z to 16:14:39Z, after which it gave rc 0, all pass.
- Every run's headSha is 10fb48ab70cff55d985ea0bd101677d9379961e3:
  - Product CI — shell, push and pull_request: vitest/cargo test passed in 8m36s and 8m15s; the tauri build passed in 4m47s and 3m49s.
  - Governance CI, push and pull_request: passed.
  - DCO sign-off: passed.
  - Exposure scan: passed.

## Repository checks at 10fb48a
| Check | Exit code | Result |
|---|---|---|
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 366 pass, 0 fail |
| `node scripts/plan/verify-cites.mjs` | 0 | PASS, 1085 files; 75 advisories, none in the diff |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS, 113 checked; 0 hash-reference errors |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS, 463 claims |
| `node scripts/plan/verify-mutation.mjs --base f5c87b0 --head 10fb48a` | 0 | PASS, "all 0 new test(s)" |

The verify-mutation PASS is vacuous, as at gate 1: the tool counts new test names, and this piece changes two existing tests. The mutation observations of record are the runs in checks 2 and N1.

Files:
- C:\dev\wt\publish-regex\frontends\shell\src\publish\PublishPanel.test.ts
- C:\dev\wt\publish-regex\frontends\shell\PUBLISH-PANEL-RS-REGEX-LAYOUT-PREREGISTRATION.md
- C:\dev\spatial-ide\state\consults\gates\2026-10-02-publish-panel-rs-regex-layout-gate1-reviewer.md
- C:\dev\wt\publish-regex\docs\PREREGISTRATION-TEMPLATE.md (the Round 25 additions section, item (d))
