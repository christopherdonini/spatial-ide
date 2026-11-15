*Custodian's filing note (2026-11-08): the stale-harness worker's stop report, from its hand-back byte for byte (5570 bytes, sha256 9fa015c51d87ee02c27ac7810dc82cad9c590a005e6040962639e459b3dd74e2), saved with one final newline. Its brief was given by file (12230 bytes, sha256 8573e7eb615c7bb788ca1250b418104b892f2d375e571297d94efa8aed6936b0). Dispatched at 18:16:46Z by its transcript; the hand-back at 18:21:34Z (claude-sonnet-5-5; unique calls: Read 7, Bash 19, Edit 15, Write 6, SubagentHandback 1, 48 in all). Checked by the custodian in its worktree: the local commit 0c92da34 on 75390735, not on origin; the porcelain empty; 21 insertions and 15 deletions in regression.mjs, 13 and 6 in App.lateResult.test.tsx. The stop is the custodian's omission in the form's settlement; the form's Amendment 1 (class 1) widens the check.*

---

Stopped: stale-harness-comments-find-prime-and-late-result, the comment-only diff check exits 1 on four doc-comment lines.

**Why I stopped.** Your `^[+-]\s*//` check rejects the four lines of the `/** ... */` doc comment of `settledUnmintedTilesSince` (regression.mjs:2088-2089 at B):
- `- * still mid-retry -- the false PREMISE-BROKEN reading an eager read could produce would silently`
- `- * skip the pre-committed assertion, which is the one outcome this step must not allow.`
- `+ * still mid-retry. `stepFind` reads the result only in its `observed` summary, never in a branch`
- `+ * condition.`

They are comment lines, but not `//` lines. The form lists that doc comment among the six OPEN-3 lines, and its note 3 step 4 says every changed line is a `//` line. The form's check and the settlement's scope disagree. The decision is yours: widen the check to `^[+-]\s*(//|\*|/\*)`, or rule on the doc-comment lines. I did not route around it.

**State.** Commit 0c92da34497a8d2d13474171fcc481bb33399dfa on branch `cut/stale-harness-comments-find-prime-and-late-result` in `C:/dev/wt/shc`. It is local only and not pushed. `git status --porcelain` is empty. No background shell or process is left running. I ran no hold, so none are shown. I did not run the shell typecheck, vitest, `npm run verify`, the scripts suite or the `verify-*` tools, or step 5's clause check.

**Setup.**
- `origin/main` is 75390735fc3afb82cbc750f6bdd498274bad03c5, and the form's sha256 at it is 212dffea…97d6, as the brief states.
- The worktree is `C:/dev/wt/shc`.
- `npm ci` exited 0 in `frontends/shell` and in `renderer/bundle-viewer`.

**Step 1.**
- `git diff --quiet 058244086f99 B -- <file>` exited 0 for all seven files: candidateArmSession.ts, tileViewportStreamManager.ts, predicate.rs, pool.rs, tileGridConstants.ts, regression.mjs and App.lateResult.test.tsx. So every pin is at 058244086f9914525ea8e4761c7baa07ea4f6e62.
- Every finding holds at B, with the same line numbers:
  - Step 4 pushes a failure at regression.mjs:2267, :2274 and :2282, and throws at :2331-2333.
  - The only `records.push` is inside the comment at :2259.
  - `unminted` is assigned at :2255 and read at :2319-2322.
  - predicate.rs:145-147 acquires `LeaseClass::Admission`.
  - pool.rs:132 is `MAX_ADMISSION_CONNECTIONS: usize = 4`, and pool.rs:111-115 declares it as 3 tile streams plus 1 baseline query.
  - tileGridConstants.ts:40 is `MAX_IN_FLIGHT_TILE_STREAMS = 3`.
  - candidateArmSession.ts:1061 is the `onSessionEnded` option, and :1089-1103 is `endCandidateSession`, which fires the dependency at :1102.
  - `issueUntiledQuery` is at :1271, with its `stopped` returns at :1272, :1286 and :1291 and `await viewportQuery` at :1283.
  - The `query-issued` emission is at :1705, and the `applyScanEvent` type is at :146.

**Changes** (all in the commit; the exact before and after are in `git show 0c92da34`).
- regression.mjs :1930: the path is now `governance/forms/frontends/FILTER-84-85-PREREGISTRATION.md`, on one line, with no rewrap.
- regression.mjs :1946-1950: the architect's words, with one change. I replaced "No branch reads the unminted-tile counts" with "No branch of the step reads `unminted`". Reason: `settledUnmintedTilesSince` reads `counts.unmintedTiles` at :2096 as a polling condition, and that is not a branch of step 4.
- regression.mjs, status comment: the architect's words adopted. Pins: predicate.rs:145-147, pool.rs:132 and pool.rs:111-115, all at 058244086f99.
- regression.mjs :2088-2089 and :2252: my own words. The doc comment now says `stepFind` reads the result only in its `observed` summary. The step 4 comment now says `unminted` is read after the settled status, that the branches test `truncated` and the status only, and that `unminted` appears in the `observed` summary.
- App.lateResult.test.tsx:
  - :284-285 and :1215: repointed to candidateArmSession.ts:1271-1291, pinned.
  - :1247: repointed to :1705, pinned.
  - :1323: repointed to :146, pinned.
  - :1349: the architect's words, pinned at :1061 and :1089-1103.

**Runs, each with its exit code.**
- `git diff --name-only B...HEAD` exits 0 and lists exactly the two files.
- `git diff --numstat B...HEAD` exits 0: regression.mjs is 21 insertions and 15 deletions, App.lateResult.test.tsx is 13 and 6. The total is 55 against the declared 60.
- `shc-tokens.mjs`:
  - My first version, a plain scan, gave false DIFFERs. The context-free scanner mis-scans template literals.
  - I rewrote it to re-scan template tails and regex literals by hand.
  - Negative self-test: one identifier changed in a scratch copy of each file. Exit 1, DIFFER at 9649 and at 2566.
  - Real run: exit 0, both files EQUAL (13080 and 9078 tokens).
- `shc-difflines.mjs`:
  - Negative self-test on a scratch diff holding a code line: exit 1.
  - Real run: exit 1, which is the stop above (55 content lines, 4 of them non-`//`).
- `node --check e2e/regression.mjs`: exit 0.
- `shc-pins.mjs`: exit 0, 9 pins, all `ok`.
- `shc-cr.mjs`: exit 0, 0 CR bytes in `+` lines.

The scripts are `shc-tokens.mjs`, `shc-difflines.mjs`, `shc-pins.mjs` and `shc-cr.mjs` in the session scratchpad.

**Commit.** The subject is as the brief gives it. The message file has its only `@` in the first trailer line. It was made with `git commit -s`, after `git add` on the two files by name.

**Still to do.** If you widen the check or rule on the doc-comment lines, the remaining runs and step 5 are all that is left before the push. There was no off-scope edit.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
