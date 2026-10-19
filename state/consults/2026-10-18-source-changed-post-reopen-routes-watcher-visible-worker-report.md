*Custodian's filing note (2026-10-19): the worker-high's report for `source-changed-post-reopen-routes-watcher-visible`, in C:/dev/wt/wv from 71d16a11; the head aa30f99f0cccc29a3df190e170d76b0eee40c5c6 (7e9deec0 the driver, aa30f99f the walkthrough and the README), pushed; no PR. The run 2026-10-18T12:10:05Z to 12:27:45Z by its transcript (Read 11, Bash 61, Edit 10, Write 6); its one SubagentHandback call, at 12:27:44Z; no app launched and no hold taken, by the transcript. Held in scratch while main was frozen. Extracted by script; 0 path:line cite(s) de-rooted; one final newline added if absent; nothing else changed.*

---

REPORT: source-changed-post-reopen-routes-watcher-visible (worker, branch cut/source-changed-watcher-visible)

HEAD / COMMITS (base 71d16a1170c6f44ec96b3692b416278df8d00f8c; `git fetch origin` rc 0; head and clean porcelain confirmed before work)
- HEAD aa30f99f0cccc29a3df190e170d76b0eee40c5c6, pushed (`git push -u origin ...` rc 0, not forced). Remote head equals local head.
- 7e9deec0aa231fabe4930de5dedfd1db5981a90d  test: the driver (source-changed.mjs)
- aa30f99f0cccc29a3df190e170d76b0eee40c5c6  docs: walkthrough + e2e README
- Final `git status --porcelain --untracked-files=all`: empty.

LINE BUDGET (`git diff --numstat 71d16a11...HEAD`, form excluded; §7 ceilings)
- frontends/shell/e2e/source-changed.mjs: 107+101 = 208 (ceiling 220)
- frontends/shell/MANUAL-WALKTHROUGH.md: 19+14 = 33 (ceiling 40)
- frontends/shell/e2e/README.md: 5+13 = 18 (ceiling 24)
- 3 files changed (limit 6). No overrun. No product code, no dependency. File is pure ASCII (grep -nP '[^\x00-\x7F]' printed nothing, rc 1).

STEP IDS PER ROUTE (file:line; before = base, after = head; all in source-changed.mjs)
- S1-open 661 -> 690; S2-settle-and-precondition 676 -> 705 (all routes, unchanged ids).
- PRE: S3-retarget-junction 845 -> 874 (same id); S4-issue-one-query 893 -> 892 (same id); S5a-status 1030 -> 1028; S5b-residency-cleared 1056 -> 1054; S5c-picks-refused 1074 -> 1072.
- REOPEN: S3 was S3-touch-mtime (869); now S3-retarget-junction (874, shared with pre). S4 was S4-issue-one-query (893); now the same id (892) and now also asserts the pre-check line. S5a-S5c as above. R1-failed-reopen-does-not-clear 1144 -> 1142; R2-successful-reopen-clears-and-identifies 1163 -> 1161 (opens OPEN_PATH, the junction); R3-zoom-to-layer-clickable-and-effective 1205 -> 1203; R4-second-source-change-ends-the-new-session 1218 -> 1216 (same id, new body per §2.3).
- POST: S3 was S3-touch-mtime (INFO, 883); now S3-retarget-junction (INFO, 882). S4 was S4-issue-one-query-and-touch-on-mint (946); now S4-issue-one-query-and-retarget-on-mint (945). S5a-S5c as above. S5d-post-check-route-confirmed 1247 -> 1253 (id unchanged).
- fixture-integrity and harness are unchanged.

BYTE-COPIED STRINGS (script wv-walk.mjs reads `git show 71d16a11:<path>`; re-read by an independent second extraction, wv-verify.mjs, ALL OK; each occurs exactly once in the final doc; sha256 over the UTF-8 string)
- S1, `engine/src/error.rs:382-384` (the Rust `\` continuations joined): raw (with `{detail}`) 
  a79fefef7a8b452b3bc98b1f9e19ab190388e72c28391b10c024f31b64eab2f4; the one fill `{detail}` -> `{mtime}` as the row prints it b76f6730b4be49ff792a10ec54bbe9c31cc43b04eb0fe5d4aad8d1b7c1daef64. Cited as `engine/src/error.rs:380-385`.
- S2, `frontends/shell/src/App.tsx:731`, the text after `${code}: ` (template) 9d86d9d59168d261efa97fb8f1dd97bae6d39c27c7734a4641f354b87daef8ef; with `${reason}` filled `observed-change` 78688a5451ed5b11af75e163e5a54bd649ef540133f9fae960ae83b3c6349722. Cited as `App.tsx:729-732`.
- S3, guidance, `frontends/shell/src/admission/formatRefusal.ts:109-110` (two literals joined) 96f3baacac77fe1b361380b46cd107c8e4a72f3040159a91d0247d7532261177. Cited as `formatRefusal.ts:108-111`.
- K1, N6's "canvas itself changes too" sentence, kept byte-copied from the base row: 2a04856b2533a8cac1231b5aefcbed0e738a509a31a2f82c40cf802ccd2e1d49. K2, N8's optional session-log check, kept: 5e39613eaf9841ea31e587adbe21a9adeb0960ee2517d934432fd1012ab3be02.
- Re-pinned cites (each checked against the base text): App.tsx:2170-2174 (R63), :750-769 (R62), :729-732 (R61); tileViewportStreamManager.ts:940-958 (R58); formatRefusal.test.ts:158-161 (the old row's `150-159` was stale; the verbatim assertion is 158-161); RefusalBlock.tsx:14, :24-43, :28 (still right). Rows name the commit 71d16a1170c6. The walkthrough has no byte-copy I typed.

COMMANDS AND EXIT CODES (worktree root; output to files)
- node --check source-changed.mjs: 0 (after every edit batch and at head)
- pure-ASCII grep: rc 1 (no non-ASCII)
- node scripts/plan/verify-cites.mjs: 0 ("every rooted path:line reference across 2013 files resolves"; no cite into source-changed.mjs broken by the diff)
- node scripts/plan/verify-quotes.mjs: 0 (129 checked, 98 verified, 30 baselined, 0 not found). Also run `--show-cites` on the three changed files: rc 1, 27 "quote not found" lines, all on MANUAL-WALKTHROUGH.md lines pre-existing in unchanged rows (122, 327, 333, ... 1438) plus N6's guidance quote at 949 which fails identically in that file-arguments mode on the base's row; the CI form (no args) passes. Cite-content listing read: every new path:line in N6 shows the described line.
- node scripts/plan/verify.mjs: 0 (verify:plan PASS)
- node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs": 0 (tests 464, pass 464, fail 0)
- wv-verify.mjs (second extraction of the three strings and ten cites): 0
- wv-helpers-test.mjs (my own scratch fixture; slices makeJunction/layoutJunction/requireWindows/repoint/assertRepointed out of the driver, never imports it): 0; ten checks ok (junction opens a, copies hash equal, b's mtime ahead, repoint to b and back resolve right, wrong-target and changed-copy errors named, targets survive repoints, off-Windows guard text is S3's message with the label). The EPERM/EACCES branch cannot be exercised unelevated and is untested.
- git commit -s -F (two commits): 0, 0. git push: 0. No hold was taken (nothing heavy). I did not launch the app, run any route, or create a junction outside my scratch fixture; the e2e routes and W-M1 to W-M5 are the custodian's.

DIFFERENCES FROM THE FORM OR BRIEF, AND WHY
1. §2.3's S4 conditions: followed literally (`ROUTE !== "post"` for the drag count and the pre-check line). They are redundant inside S4's own `ROUTE !== "post"` branch, but literal fidelity cost fewer lines than removing them.
2. §2.5 post-check header: the form says the sentences naming the touch in R23. That region has no "touch"; I changed only the two sentences false for a repoint (the pre-check route "mutates the file" -> "repoints the junction", the sibling "already-mutated file" -> "already-repointed source"). Generic "mutate/mutating" sentences are left, to stay within the 220 ceiling.
3. The post S4 comment about the poll touching the file is changed; the other "mutating" comments in S3/S4 are left (generic, true).
4. A new `repoint(target, label)` helper marks EPERM/EACCES errors `i4`; the post S4 collects it in the two race catch blocks and rethrows it after the ladder, so I4 fails S4 by name instead of vanishing into `racedError`. The ladder, its bounds, the trigger, the 5 ms poll and the stop rule are untouched. The ladder's `raced` object keeps the field name `touchedAfterNewStreamIssued` and the observation keeps `hashAfterTouch` (the form declares report field names unchanged); the helper's doc says so.
5. R4's note and fail messages are the form's. I added no report field (an `r4PreCheckLine` field was written and removed; the session log holds the line for the custodian's reading). R4 baseline is `newestSessionLog().lineCount ?? 0` taken before the repoint.
6. N6 prints S1 with `{detail}` already filled `{mtime}` (as the old row did) and says "with `{detail}` filled `{mtime}`"; S2 prints with the reason filled. Both fills are disclosed in the row; the hashes above cover raw and filled.
7. S1's step note ("scratch copy admitted") and R2's failure text ("openPath(scratch copy)") still say scratch copy, left as is.
8. The README's old `source-changed.mjs:144-159` cite is gone with the replaced paragraph; walkthrough N6's old `source-changed.mjs:871` cite is gone.
9. Q1's fixture row and "Before Q1" bullets are untouched (the form changes Q1's clause only).
Off-scope noticed, not done: the Part N preamble still says all cites were re-read at 3b23a20c220c (my N6 row carries its own 71d16a1170c6 pin); S5d's comment block still says "touched anything" (left per §2.2).

FOUR FAILURE CLASSES (checked)
- Cross-module code: no cross-module seam is written. The driver reads the app's session-log line shape (`tile-stream-mint-refused ... engine.source_changed {"detail":"{mtime}"}`) and `statusStack`'s existing DOM reads; I read `logMintRefused` (tileViewportStreamManager.ts:270-280 at the base) which writes `${tileKey}: ${code} ${JSON.stringify(fields)}`, and the driver's S4 pre route had already asserted that shape. No pub item/callback was added; the caller grep for the new helpers: requireWindows (S3, S4 post, R4), repoint (S3, R4, the post poll), assertRepointed (S3, post S4, R4), repointOnFirstNewStreamIssued (post S4, two rungs), layoutJunction (main).
- Completion claims: each "done" thing points at a run above: the helper behaviours at wv-helpers-test.mjs; the byte-copies at wv-verify.mjs; the budget at the numstat; the suites at their rc. The routes themselves are NOT run: the claim "E2E-verified for the three routes" is the custodian's, from the exclusive-hold runs; W-M1 to W-M5 are not applied.
- User-facing messages: every walkthrough string in N6/N8 describes behaviour read at the base (the two possible N6 messages, the guidance, the code chip, no dismiss control); no app string changed; S5d's pass note is A.1's wording, with its refusal message's word `touch` -> `change` only.
- Required tests reach the assertion: the new R4 idle check, the pre-check-line check, the post-S4 resolve/hash checks and the I4 rethrow are real assertions reached on the paths the form names; whether each fails by name under W-M1 to W-M5 is for the custodian's mutation runs. Not reached by anything I ran: any step body that needs the app.

MODEL: the harness reports claude-sonnet-5-5 (Sonnet 5.5). No model override. No context handoff received or produced.

Note for the custodian: a shell heredoc turned `\\` into `\` in two of my scratch scripts (already caught; the repository files were checked after: R4's regex in the driver reads `/tile-stream-mint-refused.*engine\.source_changed \{"detail":"\{mtime\}"\}/`).
