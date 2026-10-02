# Worker report 2 — publish-panel-rs-regex-layout (2026-10-02)

*Custodian's filing note: the worker's hand-back on correction round 1 for PLAN node `publish-panel-rs-regex-layout` (the gate-1 reviewer's S2-1; the form's class 4 `Amendment:` line at branch commit a0aae0e), recorded verbatim below with the harness's report indentation removed. No rooted `path:line` cite needed de-rooting; nothing in the text is changed.*

*The custodian's checks:*
- *branch `cut/publish-panel-rs-regex-layout` at b850f5e, read from origin, one commit on a0aae0e, touching only `PublishPanel.test.ts` (6 insertions, 4 deletions over a0aae0e);*
- *the worktree is clean;*
- *the vacuity check the custodian asked for was mis-designed: on c6d1414's file the mutated regex fails at the file match before the variant is reached. The custodian reads S2-1's closure from the new guard, `expect(moved).not.toBe(rustSource)`, passing in the seam proof on c6d1414's file, and put that reading to the gate-2 reviewer;*
- *the superseded index for the two re-observed comments is the form's line at 10fb48a.*

*Profile paths redacted at filing: none.*

---

Correction round 1 (S2-1) is done in commit b850f5e, pushed on cut/publish-panel-rs-regex-layout on top of a0aae0e. I read the form's Amendment line and did not edit the form. The tree is clean (`git status --porcelain` empty).

**Fix, in PublishPanel.test.ts only, both tests:**
- `moved = rustSource.replace(/(<NAME>\s*:\s*&str\s*=)\s*"/, '$1 \t\r\n    "')`.
- `expect(moved).not.toBe(rustSource)` added.
- The existing same-captured-value assertion, the regexes, the capture groups, the collapse step and the expected values are unchanged.
- Both RECORDED MUTATION comments now say "observed on the corrected tree, base a0aae0e plus this change".

**Numstat, `git diff --numstat origin/main...HEAD`:** the form is `2 0` and PublishPanel.test.ts is `14 2`, which is 16 changed lines (budget 20). One file besides the form.

**Observations (applied, run, reverted)**, all on a0aae0e plus this change, uncommitted:
- **Baseline:** 42 of 42 pass.
- **Mutation, FILTER regex `=\s*"` set back to `= "`:** fails by name at the in-memory expect, `PublishPanel.test.ts:229`. The test is `FILTER_SCOPE_SENTENCE -- pinned against publish.rs's own copy > matches ... Rust line-continuation collapsed`. The failure is `expected undefined to be 'this bundle format cannot record a ro…'`.
- **Mutation, PREPARE regex:** fails by name at `PublishPanel.test.ts:478`, `expected undefined to be 'prepare:'`. The test is `prepareCancelKey -- pinned against ... > PREPARE_CANCEL_KEY_PREFIX matches ... exactly`.
- **Vacuity check, c6d1414's publish.rs with the FILTER mutation:** the FILTER test fails (1 failed, 41 passed), so the vacuous pass is closed. It fails at the earlier `expect(match).not.toBeNull()` rather than at the in-memory line. The mutated regex cannot match c6d1414's own newline layout at all, and the in-memory assertion is not reached.
- **Seam proof with c6d1414's publish.rs, unmutated:** 42 of 42 pass.
- **Seam proof with main's publish.rs, after `git checkout --`:** 42 of 42 pass.

**Checks, exit codes captured directly:**

| Check | rc |
|---|---|
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 |
| verify-cites | 0 |
| verify-quotes (`--show-cites` on the changed file) | 0 |
| verify-test-claims | 0 |
| `verify-mutation --base origin/main --head HEAD` | 0 |

PublishPanel.test.ts alone gives 42 of 42 passed, run after the commit.

**Deviation:** the vacuity failure site above, which I report rather than gloss. Scratch scripts are in C:/dev/wt/ (outside the worktree, untracked). I ran no whole-suite re-run this round, since the diff is test-only in one file.
