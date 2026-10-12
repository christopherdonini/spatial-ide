# PR #200 gate 1 — reviewer
Reviewed: cut/known-limitations-item-8-filter-not-published @ 48329927bad6c0f09a0fc0f88023b5a57e54bdbc

**Verdict: PASS.** I found no Correctness or Evidence finding. There are four Documentation findings (D1–D4). Each must be fixed in this PR before the merge, with no re-gate. Base: 8e093734. Three-dot range: origin/main...HEAD. The worktree `C:/dev/wt/kl8` was left clean at the head. I made no commit, rebase or merge.

## Correctness
None.

## Evidence
None.

## Documentation (each one must be fixed before the merge)

- **D1. Amendment 21 cites unpinned line numbers in an append-only record.** `RELEASE-0.1.md` Amendment 21 cites four bare line ranges in code files: `frontends/shell/src-tauri/src/publish.rs:117-119`, `:72-74` and `:634`, and `frontends/shell/src/publish/PublishDialog.tsx:254-257`. The round 14 root-cause rule says a reference that must carry a line is pinned `path:line @ <commit> sha256:<hex>`. Bare cites into rolling code drift. The old item 8 comment shows this: it cited `kernel/src/publish/error.rs:238-249`, but the Display is now at :376 at 8e093734. The fix is to pin all four at 8e093734, which is on main, or reduce them to symbol names. The tag cite is already pinned correctly.
- **D2. The new item 8 comment repeats the same unpinned cites.** The comment in `KNOWN-LIMITATIONS.md` carries the same four bare cites. The human's same instruction, `state/directives/2026-10-10-drift-sweep-area-e-instructions.md`, part 1 item 1 (line 7), orders the unpinned cites in this file's comments (finding 6) replaced with pinned ones. A new comment should not bring that class of defect back. The fix is to pin them as in D1.
- **D3. Two cites cover only the viewport arm.** The comment and Amendment 21 cite `publish.rs:117-119` (at the tag, :108-110) as "the publish scope's query is built with filter: None". Those lines are the `ViewportBbox` arm only. The `WholeFile` arm is `ViewportQuery::all()`, whose `filter: None` is at `engine/src/stream.rs:263` @ 8e093734 and `engine/src/stream.rs:216` @ b391e436. The claim is true for both arms; the cite proves only one. Add the `all()` cite, pinned.
- **D4. Amendment 21's corrections run over the three-sentence ceiling.** Round 12 item (d) caps a correction at three sentences: the defect, the corrected reference, the proof. The "Corrections to this record" subsection has four. Bullet 1 has two, bullet 2 has one, and bullet 3 ("…stands as recorded; nothing above it is edited") has one. Bullet 3 states none of the defect, the reference or the proof, and the append-only check already proves it (see check 2). Cut to three or fewer.

## Checks

1. **Out-of-scope line (§21b, read first): true.** The diff touches no ADR file, nothing under `protocol/`, no code, no test and no string the app shows. The publish code, the dialog and `engine/src/stream.rs` are unchanged between 8e093734 and origin/main. No §21a guarantee or tested property changes; the documents are brought into line with unchanged code. Not a block-on-sight.
2. **Scope: holds.**
   - `git diff --numstat origin/main...HEAD` (rc 0) shows `KNOWN-LIMITATIONS.md` 2/8, `RELEASE-0.1.md` 8/0 and `MANUAL-WALKTHROUGH.md` 1/1.
   - That is 20 changed lines over 3 files, against a budget of 60 over 4. `PLAN.yaml` is declared in Scope but untouched; the PR body says the custodian changes it at the merge.
   - `KNOWN-LIMITATIONS.md`: only item 8 and its HTML comment change.
   - `MANUAL-WALKTHROUGH.md`: only row M8 changes, and no result log is touched.
   - `RELEASE-0.1.md`: the first 165,309 bytes at the head equal the base file byte for byte (`cmp`, rc 0). There are no removed lines, and only `## Amendment 21` is appended after Amendment 20.
   - The branch merges cleanly into origin/main (`git merge-tree`, rc 0).
3. **Byte-copies, by script: both hold.**
   - Item 8 (`KNOWN-LIMITATIONS.md:101`) equals instruction line 18 with its leading spaces removed. The sha256 of both is 41e63eba3f959db4756294a9afe1cf5ec74eb0aed58e4dff62bf5c096381ec6a, and the file has no CR.
   - Row M8: a node script took the two double-quoted spans from instruction line 20. The first span occurs once in the base file and zero times at the head. Replacing it once in the base with the second span gives the head file exactly (`true`, rc 0).
   - The dialog sentence inside item 8 equals `FILTER_SCOPE_SENTENCE` in `frontends/shell/src/publish/types.ts:128-129`, byte for byte, at 8e093734 and at b391e436.
   - The Rust constant at `publish.rs:72-74` gives the same value once Rust's `\`-newline string continuation is applied.
4. **The clauses against the code at 8e093734: none reads wrong.**
   - **No filter is sent.** `PublishScope::to_query` sets `filter: None` (`publish.rs:119`), and `ViewportQuery::all()` does too (`engine/src/stream.rs:263`). The binding takes only `filter_active: bool`. The kernel refusal fires only on `req.query.filter.is_some()` (`kernel/src/publish/mod.rs:459-460`), so with no filter sent it cannot fire.
   - **The prompt and dialog carry the sentence.** The prompt carries `filter_scope: filter_active.then(...)` (`publish.rs:634`), and the dialog renders it (`PublishDialog.tsx:254-257`).
   - **The button label matches.** "Export interactive map…" is the label (`PublishPanel.tsx:607`).
   - **The bundle version is 1.** `BUNDLE_VERSION` is 1 (`kernel/src/bundle/mod.rs:53`).
   - **The comment's tag claim holds.** At b391e436, `filter: None` is at `publish.rs:110`, `all()` sets `filter: None`, `BUNDLE_VERSION` is 1, and the dialog renders `filter_scope`.
   - **One clause reads wider than the code (named, not wrong).** "Rows you filtered out of the map are in the bundle" is exact for a whole-file export. For a current-view export it holds only for rows inside the view's extent. This is the human's own text; the custodian's check (Part 2 item 1, clause 4) already raised it, and PR body sight item 2 puts it to the human. I propose no wording.
5. **Cites and pins: all hold.**
   - `publish.rs:108-110 @ b391e43622056324c56d35cc33065305140a8415` recomputes to sha256 73d3f7ef00209f37995058f2442931ec4b6e2f01acd430e918c302168eb94527, a match.
   - `state/directives/2026-10-10-drift-sweep-area-e-instructions.md:16-20 @ a7935e18cd6faebe486debbbec9049cdbfade36c` recomputes to 26e295fe07482acaf34d68c1cd73faa0b0e00df7bab5a4e5eeca8a8f6392bf67, a match. The file is unchanged from a7935e18 to the head.
   - Both pinned commits are ancestors of origin/main.
   - The bare cites (`publish.rs:72-74`, `:117-119`, `:634`, `PublishDialog.tsx:254-257`) resolve at the head to the content claimed. The pinning issue is D1/D2.
   - Rows M8 and G8 exist; G8 (`MANUAL-WALKTHROUGH.md:331`) expects the sentence.
   - Amendment 21's account of Amendment 15 matches `RELEASE-0.1.md:1201`.
   - The form's docs-lane pins also recompute at 6e9b74cf: line 23 gives 14ae9553…daa8, lines 17-21 give a93e0c94…3707.
6. **Governance checks: all pass.** Each was run at the head (48329927), with the tools at that commit.
   - `node scripts/plan/verify-cites.mjs`: rc 0, PASS. It gave 53 loose-reference advisories, none in the three changed files.
   - `node scripts/plan/verify-quotes.mjs`: rc 0, PASS.
   - `node scripts/plan/verify-test-claims.mjs`: rc 0, PASS.
   - `node scripts/plan/verify.mjs`: rc 0, PASS.
   - `node scripts/plan/queue.mjs --check`: rc 0, current.
   - `node scripts/plan/site.mjs --check`: rc 0, current.
   - `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: rc 0, 457 pass, 0 fail.
7. **CI: all six checks pass.** `gh pr checks 200` (rc 0), every line printed:
   - every commit is signed off: pass
   - no profile path in the range: pass
   - tauri build (NSIS, build-only, no signing): pass ×2
   - typecheck · build · vitest · cargo test: pass ×2

   `gh run view` confirms all four runs are at headSha 48329927bad6c0f09a0fc0f88023b5a57e54bdbc. None was pending.
8. **PR body: accurate against the head; low profile holds.**
   - The base, head, size (20 lines, 3 files) and file list match the head.
   - "item 3a" matches the docs-lane directive's item 3, order a (line 23 @ 6e9b74cf).
   - Sight item 1 asks the human about a visible correction sentence, as the form's Change line commits to.
   - The title, body and commit message contain no outside issue or PR reference and no @mention. The only link in the body is the session attribution link.
