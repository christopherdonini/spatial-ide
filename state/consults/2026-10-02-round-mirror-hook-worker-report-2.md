# Worker report 2 — round-mirror-pretooluse-hook, correction round 1 (2026-10-02)

*Custodian's filing note: the worker's hand-back on correction round 1 for PR #154, covering the reviewer's gate-1 S1-1 and S2-2 and both gates' note on non-object JSON. It is recorded verbatim below with the harness's report indentation removed. Branch `cut/round-mirror-hook` at fa674a7. The custodian's checks: the diff 948f126..fa674a7 is 17 insertions and 4 deletions over four files (README, fixture, hook, tests). The custodian then appended the form's Amendment 2 as 2e364d6.*

---

Correction round 1 is done: one commit, fa674a7, pushed on cut/round-mirror-hook; the worktree is clean. There was no force-push or `--no-verify`, and the trailer names Claude Sonnet 5.5 plus the Claude-Session line. I left the form and §28's heading alone.

**Diff summary (4 files)**
- `scripts/hooks/fixtures/pretooluse-askuserquestion.json`: added `tool_name: "AskUserQuestion"`, `prompt_id: "fixture-prompt"`, `tool_use_id: "fixture-tool-use"` and `permission_mode: "default"`. `tool_input` is unchanged.
- `scripts/hooks/README.md`: H4 is now labelled a hypothesis (4 changed lines across the README and the hook code).
- `scripts/hooks/questions-mirror.mjs`: valid JSON that is not an object (`null`, `[]`, a number) now prints the malformed line ("hook input carries no well-formed questions; no round written."). That line is one of §7's six. The "not JSON" line is kept only for unparseable input. Exit stays 0, and nothing is written or sent.
- `scripts/hooks/questions-mirror.test.mjs`: T10 gained the three stdin cases `null`, `[]` and `7`.

**Re-observations.** All four were applied, run and reverted at fa674a7 (the mutate script also reverted the tree each time). The first failing assertion is unchanged for all four, so I left the RECORDED MUTATION comments as they were.
- M1: T1 `assert.equal(text, S1_BODY(date))` fails, so T1 reads the fixture with the extra keys.
- M9: T9 stderr `assert.equal` fails with the "hook error (Unexpected token…)" line instead of the not-JSON line.
- M10: T10 stderr `assert.equal` fails on the `[]` case (a dry-run send appears instead of the malformed line).
- M11: T11 `assertQuiet` fails with status 1 where 0 is expected, so T11 passes unmutated with the extra keys.

I did not run a separate mutation against the three new non-object cases.

**Checks**
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: exit 0, 379 tests, 379 pass, 0 fail.
- `verify-mutation --base origin/main --head HEAD` (tool commit 7d24ed1): exit 0, all 13 new tests have a recorded mutation naming them.

**§7 count.** The merge-base is 01b5ba0 and the head is fa674a7. §7's command gives 7 files, 497 insertions and 3 deletions, which is 500 changed lines against the 700 ceiling.
