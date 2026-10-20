*Custodian's filing note (2026-10-20): the worker's report for PR #236's gate 1 word round (the TTL form's Amendment 5 items 1 and 2), no re-gate; the run 2026-10-20T21:55:48.220Z to 2026-10-20T22:00:03.298Z; handback 2026-10-20T22:00:02.550Z; Bash 7, Monitor 1, Write 1 by its transcript. The custodian checked the branch at 024fde37885c9f1a213894f4dc4f35cbee2b0a48: grant.rs line 412 and PublishDialog.tsx lines 9 to 15 byte-equal to the architect's words. The word files' names differ from the brief's prefix, as the report says. Extracted by script; one final newline added if absent; nothing else changed.*

---

Both gate-1 comment fixes are applied and pushed as one commit. Every check passed, but the diff now touches a file the form's Scope does not list (see Scope below).

**Head and commit:** the branch was at 5e922915419fff578d862ae1a47aefa39c955ba2 with a clean tree after `git fetch origin`. The new commit is 024fde37885c9f1a213894f4dc4f35cbee2b0a48, signed off, with the subject you gave. `git push origin cut/publish-approval-ttl-ten-minutes` was an ordinary update (5e922915..024fde37), rc=0.

**Word files:** they are named `ttl-c1-*.txt` and `ttl-d1-*.txt` in the scratchpad, not `ttl-words-*` as the brief said. The sha256 values I checked all matched the brief:
- c1-old: 1aadfeb71cd802ee9a51a100fd4346681a2d5b280c08985b6c5f62ea5be3743c
- c1-new: 359df61f0622c2c0f81383b577dbb6d496e09e7277482257daa5daadc57d5b32
- d1-old: 007390af3017b45118680812b14045d214c429bd808a5dfe38d5e9b435e7b6af
- d1-new: e8ae5d894a05a03314175ec78cb9238f5dce7fe8cd7838eef99fafef9007d43c

**Where the words landed:**
- `kernel/src/permission/grant.rs` line 412 now reads "...expired naturally at the end of its own lifetime...".
- `frontends/shell/src/publish/PublishDialog.tsx` line 9 became the seven-line block, now lines 9 to 15. The "P6 placeholder" line is line 10.
- The script, `ttl-words-apply.mjs` in the scratchpad, read bytes, required each old text exactly once, stripped the word files' final newline, and kept LF. The diff against the head was 7 insertions and 1 deletion in `PublishDialog.tsx`, and 1 and 1 in `grant.rs`.

**Scope counting command** (`git diff --numstat origin/main...HEAD`, form excluded), after the commit:

| File | Insertions | Deletions |
|---|---|---|
| `frontends/shell/MANUAL-WALKTHROUGH.md` | 2 | 2 |
| `frontends/shell/e2e/README.md` | 1 | 1 |
| `frontends/shell/e2e/exportElapsed.test.mjs` | 3 | 2 |
| `frontends/shell/e2e/publish.mjs` | 6 | 5 |
| `frontends/shell/src-tauri/src/publish.rs` | 34 | 2 |
| `frontends/shell/src/publish/PublishDialog.test.ts` | 24 | 0 |
| `frontends/shell/src/publish/PublishDialog.tsx` | 12 | 1 |
| `kernel/src/permission/grant.rs` | 1 | 1 |

- **Totals:** 83 insertions and 14 deletions, 97 changed lines, against the budget of 120.
- **`PublishDialog.tsx`:** 13 changed lines, against the cap of 15.
- **`kernel/src/permission/grant.rs`:** it is not listed in the form's Scope, so it is now an extra file on the diff. That follows from the architect's C1 words. You or the architect may want to look at it.

**Commands** (foreground, output sent to files in the scratchpad):
- `npx vitest run src/publish/PublishDialog.test.ts` in `frontends/shell`: rc=0, 1 file and 19 of 19 tests passed.
- `node scripts/plan/verify-cites.mjs`: rc=0, PASS across 2097 files, with 88 loose-reference advisories.
- `node scripts/plan/verify-quotes.mjs`: rc=0, PASS (129 checked, 98 verified, 30 baselined, 1 advisory).
- The Scope counting command: rc=0.
- I did not build the crates, as instructed.
- I did not look for D1 and D2 by name in the vitest output. I only have the 19 of 19 count.

**Final porcelain:** empty (`git status --porcelain --untracked-files=all`).

**Model:** Sonnet 5.5, claude-sonnet-5-5, as the harness reports it. No override and no context handoff.
