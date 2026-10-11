*Custodian's filing note (2026-10-11): ported-code-notice-route worker report 3, gate 2's documentation findings (architect D-1, reviewer D-a), the worker run 11:04:56Z to 11:09:54Z by its transcript (Write and Edit calls 0, all in C:/dev/wt/pcnr), on cut/ported-code-notice-route, head e98b6ec961a0162e0d5ce09c7fdf173279d7d4c9, published; the custodian checked the range 7b58300b..e98b6ec9 touches CONTRIBUTING.md (1/1) and LICENSES/third-party/ported/README.md (3/3) only. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with one final newline added and its 8 branch-only path:line cites de-rooted by script (each written as line N of the path, at that head). The sha256 of the report as handed back is 56f2bb59b463db68e61c8d238859625a1beabc6d86b69976a16db669576f36de.*

---

Both gate-2 documentation findings are fixed and pushed. The new head is e98b6ec961a0162e0d5ce09c7fdf173279d7d4c9, a plain push on top of 7b58300b. I checked first that HEAD and origin were both 7b58300b156e52ddb0d0a8ec8fa5162b0cc5ac45 and that the status was clean.

**Edits.** Before-lines are the old text, after-lines are the new text. Only the changed clauses are shown. Everything before them in each line is unchanged.
1. line 57 of `LICENSES/third-party/ported/README.md` (`files[].path` row):
   - Before: "Outside a checkout (no `.git` entry at the root) the tracked test cannot run, and the check reads the file from the disk instead, so it must exist there"
   - After: "Outside a checkout (no `.git` entry at the root) the repository check fails by name; the prebuild check cannot run the tracked test there and reads the file from the disk instead, so it must exist there"
2. line 58 of `LICENSES/third-party/ported/README.md` (`adopted_by` row):
   - Before: "outside a checkout only its form is checked"
   - After: "outside a checkout the repository check fails by name, and the prebuild check checks only its form"
3. line 62 of `LICENSES/third-party/ported/README.md`:
   - Before: "A build from a source archive that is not a git checkout (no `.git` entry at the root) checks…"
   - After: "A packaged build from a source archive that is not a git checkout (no `.git` entry at the root) checks…"
4. line 172 of `CONTRIBUTING.md`:
   - Before: "A build outside a git checkout (a tree with no `.git` entry at its root) does not search…"
   - After: "A packaged build outside a git checkout (a tree with no `.git` entry at its root) does not search…"

**Code check.** The new wording holds at the head:
- lines 30-35 of `scripts/check-ported-notices.mjs` fails outside a checkout and the file has no archive mode.
- `portedPrebuildCheck` at lines 312-316 of `renderer/bundle-viewer/portedNotices.mjs` returns a NOTE when the tracked listing is null.
- lines 68-73 of `frontends/shell/scripts/generateNotice.mjs` says the same about the prebuild check.
- line 12 of `frontends/shell/package.json` wires the prebuild to `generate:notice`.

**Runs.** All five exited 0.
- `node scripts/check-ported-notices.mjs`: 0
- `node scripts/plan/verify-cites.mjs`: 0
- `node scripts/plan/verify-quotes.mjs`: 0
- `node scripts/plan/verify-test-claims.mjs`: 0
- `node scripts/plan/verify.mjs`: 0

The first four ran before the commit, on the edited working tree. `verify.mjs` was re-run after the commit; its first run's exit code was lost.

**Budget.** `git diff --numstat 81d98ed9b24727d9f013f5141ba7a4fc5f70b038...HEAD` sums to 1,279 added plus 5 deleted, 1,284 lines, in 19 files. That is within 1,550 lines and 20 files.

**Final `git status --porcelain`.** Empty.
