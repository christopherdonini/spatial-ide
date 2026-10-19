Reviewed: PR #230 at f4db87382d031d2f9a24329ac7752e1d02e48bde (base 71d16a11)
Branch and commit: cut/known-limitations-item-23 @ f4db87382d031d2f9a24329ac7752e1d02e48bde
Verdict: PASS

**Correctness:** none.

**Evidence:** none.

**Documentation:** none.

**One observation, not a finding, no fix needed.** §D row 3 of the form says its self-test at M prints 1. When I ran it again it printed 2: M's lines 279 and 286, item 23's text and its source comment. The custodian's record `state/consults/2026-10-17-known-limitations-item-23-tag-checks.md` item 3 already discloses this. Both hits are item 23's own, so the pattern is positive. This PR does not change the form, and the form is append-only.

**The checks**

1. **The words.**
   - The diff is `KNOWN-LIMITATIONS.md` only: 15 lines in, 9 out (numstat).
   - The 9 old lines are base lines 278-286: item 23's 8 text lines and its one source-comment line, followed by a blank line and then item 24.
   - My script took the form at the base. It used §A's 14 item lines (form lines 17-30) with their 4-space block indent removed, and the comment at form line 34 with its 4 leading spaces kept. It replaced the bracket (present once) with `The human's wording, approved` and `<date>` (present once) with `2026-10-18`.
   - The base file with those lines put in equals the head file byte for byte: 84960 bytes each.
   - The 2026-10-18 date matches the commit time, 2026-10-18T14:14:30+02:00, which is 12:14Z.
   - The approval is the human's own: directive `state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md` item 2 says "yes to §A's words as drafted, item text and source comment". This matches Amendment 1 items 1-2.
   - Self-test: a one-byte edit to head line 281 makes the script fail (rc=1).
2. **Every other line is unchanged** (same script).
   - Lines 1-277 are identical.
   - Every line after the block is identical (base 287 onward against head 293 onward).
   - The line count changes by exactly +6.
3. **The pins.** All 25 `path:line @ rev sha256:hex` pins in head line 292 recompute at 607d8d166f26…, over whole lines from `git show rev:path`, LF bytes, with no CR. 25 matched, 0 mismatched. A count of `sha256:` tokens on the line also gives 25. Self-test: one changed hex digit gives rc=1.
4. **The clauses (§B C1-C16) all hold at the base.**
   - Between M and the base, `git diff --stat 607d8d16 71d16a11` over engine, kernel, protocol, `frontends/shell/src` and `frontends/shell/src-tauri/src`, and over every cited doc and run file, is empty. So the code at M is the code at the base.
   - I read the cited code at the base. The parts each clause rests on:
     - **The watch ends the session with no query:** the sink's `Admitted` arm calls `end_generation` (`skp.rs:1140-1168`), and `end_generation` does record, `try_send`, cancel (`:914-926`; `:895` drops the event when the queue is full).
     - **Where the watch is not armed:** off Windows, `PlatformWatch::arm` returns `ChecksOnly` (`watch.rs:86-103`); failed arming returns `ChecksOnly` (`:603-636`, `:666-668`, `:683-709`); the filters are at `:653-654` and `:695-704`; a checks-only dataset is still admitted (`skp.rs:1261-1289`).
     - **The event reaches the screen:** `PlatformWatch` is the product arm and the emitter thread logs a failed emit (`lib.rs:286-315`). The listener logs a failed registration (`App.tsx:1366-1397`). The event is routed to `dispatchSessionEndedToOwner`, then the candidate manager's `notifySessionEnded`, then `endSession`, then `endCandidateSession` (`canvas?.clearAllTiles()`, then `deps.onSessionEnded`), then the App's `endSession` and `handleSessionEnded` (`:687-699`), and the block renders at `:2170-2174`.
     - **The tiled arm is the default:** `App.tsx:1507-1589`.
     - **A pan inside resident tiles issues no query:** the debounced pan goes only to `manager.onCameraChange`, which queries only tiles that are neither tracked nor resident (`tileViewportStreamManager.ts:494-505`).
     - **The hover:** it refuses only once the session has ended (`pick.ts:104-106`).
     - **The refusal once a query is issued:** `require_live` (`skp.rs:1436`), the pre-check ending the generation (`:1449-1455`), and a refused mint ending the session in the app (`tileViewportStreamManager.ts:940-958`).
     - **The undetectable change:** `descriptor.rs:13-18`.
   - **History in the comment:**
     - "written when (PR #109)": pickaxe commit aff66920 is reachable from #109's merge 0ea50d05 but not from its first parent, and item 23 is absent at that first parent.
     - "watcher merged (PR #127)": the merge commit is 9a42af2004dce3d38d78dab61c276e47a5fcdb3b, merged 2026-09-26T19:03:32Z.
   - **Item cross-references:** items 19, 24, 25, 26 and 28 at the head carry the subjects the new text gives them.
   - **Directive cite:** `item 2c` resolves in `state/directives/2026-10-11-direction-after-status-review.md` (its line 20 is item 2's sub-item c).
5. **§D at the tag, run again.**
   - Row 1: `ls-tree` at the tag prints 0 bytes (rc=0); at M (and at the base) it prints `engine/src/watch.rs` (rc=0).
   - Row 2: `git grep` at the tag gives rc=1 with 0 bytes; at M, rc=0 with 204 lines.
   - Row 3: `grep -c` at the tag prints 0 (rc=1); at M it prints 2 (rc=0), the observation above; at the head it prints 1, the comment's own "Revised" sentence.
   - Row 4: `gh pr view 127` gives rc=0. `--is-ancestor` of 9a42af20 against the tag gives rc=1, against M rc=0, and against the base rc=0.
6. **No other item is edited or renumbered.** The sequence of 43 numbered item lines is identical at the base and the head. The only file changed is inside Scope.
   - PLAN.yaml is in Scope but not in the diff.
   - Main's drift past the base (`origin/main` bc0d1e9f) is `state/CUT-STATE.md` only, so it shares no path with this PR.
7. **Tools, in a detached worktree** `C:/dev/wt/gate230` at f4db8738 (clean, LF files), since removed (rc=0; gone from the worktree list):
   - `verify.mjs`: rc=0, PASS.
   - `verify-cites.mjs`: rc=0, PASS; 67 loose references advised, none in `KNOWN-LIMITATIONS.md`.
   - `verify-quotes.mjs`: rc=0, PASS (129 checked, 0 hash-reference errors).
   - `verify-test-claims.mjs`: rc=0, PASS (571 claimed tests).
   - `gh pr checks 230`: rc=0. Four checks, all pass: signed-off, no profile path, ported-notices twice. No other CI job reported for this docs-only PR. The PR is MERGEABLE at head f4db8738.

**Commands and exit codes (all in the foreground; output went to files in the scratch folder)**
- `git fetch origin` 0
- `git diff 71d16a11...f4db8738` 0; `--stat` 0
- `git show` of the base and head `KNOWN-LIMITATIONS.md` and of the form at the base and head: 0, 0, 0, 0; `cmp` of the form at the base and head 0
- `gh pr view 230` 0
- `node words.mjs` 0; its tamper self-test 1
- `node pins.mjs … 292` 0 (a first run with the wrong line number, 284, gave rc=1 with 0 pins found); its tamper self-test 1
- §D: row 1 at the tag 0, at M 0, at the base 0; row 2 at the tag 1, at M 0; row 3 `git show` at the tag 0 and grep 1, `git show` at M 0 and grep 0, head grep 0; `gh pr view 127` 0; row 4 `--is-ancestor` at the tag 1, at M 0, at the base 0; M an ancestor of the base 0
- `git diff --stat` M against the base over the cited files 0 (empty) and over the code trees 0 (empty)
- `git show` of each of the nine cited source files at the base: 0 each
- pickaxe `git log -S` 0; `gh pr view 109` 0; the two #109 ancestry checks 0 and 1
- `git cat-file -e` for the three directives: 0 each
- `git worktree add --detach` 0; `verify.mjs` 0; `verify-cites.mjs` 0; `verify-quotes.mjs` 0; `verify-test-claims.mjs` 0; `gh pr checks 230` 0; `git diff --name-only 71d16a11 origin/main` 0; `git worktree remove` 0

No commit, push, PR action or file write outside the scratch folder and the temporary worktree.
