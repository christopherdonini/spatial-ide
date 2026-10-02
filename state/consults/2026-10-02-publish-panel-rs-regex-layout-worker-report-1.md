# Worker report 1 — publish-panel-rs-regex-layout (2026-10-02)

*Custodian's filing note: the worker's hand-back on the brief for PLAN node `publish-panel-rs-regex-layout` (five-line form `frontends/shell/PUBLISH-PANEL-RS-REGEX-LAYOUT-PREREGISTRATION.md`, committed f5c87b0), recorded verbatim below with the harness's report indentation removed. No rooted `path:line` cite needed de-rooting; nothing in the text is changed.*

*The custodian's checks:*
- *branch `cut/publish-panel-rs-regex-layout` at 8a1b0dc, read from origin, one commit on f5c87b0;*
- *the diff is the one Scope file, 12 insertions and 2 deletions;*
- *the worktree is clean.*

*Profile paths redacted at filing: none.*

---

Built: PublishPanel.test.ts's two publish.rs-reading tests now use \s* regexes, and each also matches an in-memory CRLF copy of publish.rs. All checks pass.

**Commit:** 8a1b0dc on cut/publish-panel-rs-regex-layout, pushed. `git status --porcelain` is clean, and the form was not edited.
**Diff:** `git diff --numstat origin/main...HEAD` gives `12 2 frontends/shell/src/publish/PublishPanel.test.ts`, which is 14 changed lines (budget 20) in one file.
- **Regexes:** `FILTER_SCOPE_SENTENCE\s*:\s*&str\s*=\s*"([\s\S]*?)"\s*;` and `PREPARE_CANCEL_KEY_PREFIX\s*:\s*&str\s*=\s*"([^"]*)"\s*;`. The capture groups, collapse step and expected values are unchanged.
- **In-memory variant:** each test does a plain `replace` of `<NAME>: &str = "` with `<NAME>: &str =\r\n    "`, then asserts the same captured value as from the file. On c6d1414's layout the replace is a no-op, so the variant degenerates to a same-file match there.

**Mutation (applied, vitest run, reverted):** I put `=\s*"` back to `= "` in each regex, one at a time. I observed them with the change uncommitted on HEAD f5c87b0. I did not commit twice, so the RECORDED MUTATION comments name "base f5c87b0 plus this change", not 8a1b0dc.
- **FILTER_SCOPE_SENTENCE test:** the first failing assertion is `AssertionError: expected undefined to be 'this bundle format cannot record a ro…'` at `PublishPanel.test.ts:228`, the in-memory expect. The test is `FILTER_SCOPE_SENTENCE -- pinned against publish.rs's own copy > matches frontends/shell/src-tauri/src/publish.rs::FILTER_SCOPE_SENTENCE exactly, Rust line-continuation collapsed`.
- **PREPARE_CANCEL_KEY_PREFIX test:** the first failing assertion is `AssertionError: expected undefined to be 'prepare:'` at `PublishPanel.test.ts:476`, the in-memory expect. The test is `prepareCancelKey -- pinned against publish.rs::prepare_cancel_key's own prefix (RELEASE-0.1 item 10) > PREPARE_CANCEL_KEY_PREFIX matches frontends/shell/src-tauri/src/publish.rs::PREPARE_CANCEL_KEY_PREFIX exactly`.

Each mutation gave 1 failed, 41 passed. Both comments are in the committed file.

**Seam proof (observation, nothing committed):**
- **At c6d1414's publish.rs:** it differs from main's by 413 insertions and 105 deletions. The file was checked out, and PublishPanel.test.ts gave 42 of 42 passed.
- **At main's publish.rs, after `git checkout --`:** 42 of 42 passed.

**Counts:**
- **PublishPanel.test.ts alone:** 42 passed.
- **Whole frontend suite, `npx vitest run`:** 72 files and 1094 tests passed, rc 0.
- **`npm run test` first attempt:** its pretest build failed because renderer/bundle-viewer had no `node_modules`.
- **After the setup:** I ran `npm ci` in renderer/bundle-viewer and `npm run build` in frontends/shell (rc 0), then re-ran vitest. That is the pass above. I did not run the full `npm run verify` chain.
- **Before the build:** vitest had 17 failures on the missing build artifacts. After the build they went away.

**Check exit codes:**

| Check | rc | Result |
|---|---|---|
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | not tallied |
| verify-cites | 0 | PASS |
| verify-quotes (`--show-cites` on the changed file) | 0 | PASS, 0 checked |
| verify-test-claims | 0 | PASS |
| `verify-mutation --base origin/main --head HEAD` | 0 | PASS, 0 new tests |

The verify scripts list advisories only on files I did not touch.

**Four failure classes:**
- **Cross-module interface:** the only cross-file read is publish.rs's real declarations, which I read before writing the regexes. The seam proof ran on the real files at c6d1414 and main.
- **Completion claims:** each is backed by a recorded run above.
- **User-facing messages:** none added.
- **Required tests:** both reach their in-memory assertion, shown by the mutation failing exactly there.

**Model:** claude-sonnet-5-5, no override, no context handoff. Scratch scripts were written to `C:/dev/wt/` (outside the worktree) and untracked.

**Off-scope noticed, not done:** none.
