# PR #203 gate 2 — reviewer
Reviewed: cut/shell-stale-frame-and-layout-comments @ dce20da2c21391e6b1aca57b6ffbb58f4465c545

**Verdict: PASS.** Correctness PASS. Evidence PASS: Amendment 1 answers E1. Documentation: 3 new findings (G2-D1 to G2-D3). Each must be fixed in this PR before the merge, with no re-gate.

I worked in D:/wt/docb at dce20da2. `git status --porcelain` printed nothing and the stash list was 0, both before and after. I made no commit, no tracked edit and no remote write. Scratch files went to my scratch folder's `g2/`.

One slip, disclosed: a mistyped first call ran the four verify scripts in the background with output to `/tmp/null.txt` (exit 0). I deleted that file, and `ls` confirms it is gone. The real runs are in check 6.

`git fetch origin`: origin/main = d4fef619e94ea66df64cd74ee5fd5f35a8efaa68. The merge-base of the head with origin/main is 78fc2c7e0503e38d969cf2a9191f72253546f15d.

## 1. The form's Amendment 1 (on main)
**Append-only.** Nothing above the amendments changed:
- `git diff 78fc2c7e HEAD -- <form>`: one hunk, 21 lines added, 0 deleted, all after line 11's closing fence.
- Per commit: 96dd7d8d added 12 lines and removed 0; d4fef619 added 9 and removed 0.
- The five lines are byte-untouched.

**Route and class.**
- It records the overrun as class 6 under §21b's size-overrun clause (`AUTONOMY.md` §21b, the human's round 5, item 2). The piece keeps its five-line form, and both gates apply.
- This is the fix E1 asked for. It matches the shape of `REUSE-ROUND-1-BUNDLE-PREREGISTRATION.md`'s Amendment 1 (line 17 heading, class 6).
- Note, not a finding: the overrun was in the Scope line at dispatch rather than found mid-piece. Item 1 says so. The clause still governs, because it forbids writing a full form after the code.

**Pins.** Both recompute at 5a66b1526ff37760a6051674e4f6e8faf24fbb9e. That commit is an ancestor of origin/main (`merge-base --is-ancestor`, rc 0), which satisfies round 15 (e).
- `AUTONOMY.md:350`: 98f827948981d936522d9c9273e457c2f4f7e5e622aa917afc6fb73e0edf01f9. Match.
- `AUTONOMY.md:353`: a4939bf59c3c8f7da9614a7574cc282433a0c8b06d0d8509c296e13b218b27d7. Match.

**Other references resolve:**
- The gate-1 report path is tracked on main.
- Gate-log 465 is the 465th entry of `state/gate-log.json`: shell-stale-frame-comments, reviewer, FAIL, @ dc289564.
- Item 4 ("D1 to D5 are fixed") resolves; see section 2.
- Item 4's §15 is the generation bump that `AUTONOMY.md:47` names.

## 2. D1 to D5 (fix commit dce20da2; the sources are the ones gate 1 used, at 78fc2c7e)
- **D1 fixed.** `PublishPanel.tsx:309-311` now places Export in the Inspector's Layer tab:
  - `contributions.ts:64` says the Inspector's Layer tab takes one slot per section;
  - `StudioLayout.tsx:256-262` maps `LAYER_SECTIONS` inside `inspector-panel-layer`;
  - `App.tsx:1969` has `"section.export"`;
  - all three files are unchanged from base to head.
- **D2 fixed.** `residencyStatus.ts:358-360` now marks the quoted bullet as the drafted wording, changed to "not loaded" by the 2026-09-05 ruling.
  - Source: DECISIONS-PENDING.md:3861 @ 78fc2c7e (the 2026-09-05 block, string 2).
  - The shipped template in `relinquishedText`, below, ends "was not loaded." So the marker's own lines at :353-354 and the bullet now agree.
- **D3 fixed.** `:399-401` and `:425-426` no longer claim byte-copying. They now say the RULED block's words, with the line break collapsed to one space.
  - At DECISIONS-PENDING.md:3088-3089 @ 78fc2c7e, "as" ends one line and "shipped" begins the next after four spaces of indentation. The new label is accurate.
- **D4 fixed.** The docs/07 "Current focus" attribution is gone from `ConsolePanel.tsx`. See G2-D2 for what the edit leaves behind.
- **D5 fixed for the three named lines:**
  - `style.mjs:248-250`: at most 100 columns;
  - `WorkingCanvas.tsx:2072-2073`: at most 100 columns;
  - `residencyStatus.ts:399-401`: at most 100 columns.
  - The same edit lengthened another line; see G2-D1.

## 3. Code and strings byte-identical (my parser script, `codeident.cjs`, base 78fc2c7e against the head)
The script is the same as at gate 1. It uses the TypeScript parser from the worktree's `node_modules`, masks every comment range, then compares the remaining non-blank lines and every string, template and JSX text node.

Result: IDENTICAL for all 9 files, overall rc 0, parse diagnostics 0/0 everywhere. Code lines (base/head):

| File | Code lines |
|---|---|
| residency-harness.mjs | 1577/1577 |
| style.mjs | 460/460 |
| WorkingCanvas.tsx | 954/954 |
| hoverRepickConstants.ts | 3/3 |
| ConsolePanel.tsx | 158/158 |
| layoutBoundary.test.ts | 34/34 |
| PublishPanel.tsx | 396/396 |
| residencyStatus.ts | 109/109 |
| StylePanel.tsx | 126/126 |

String counts are equal in every file.

Controls:
- `not loaded.` changed to `not loadedX.` in the template: DIFFERENT, rc 1.
- A comment-only word added in ConsolePanel: IDENTICAL, rc 0.
- An extra space in ConsolePanel's import line: DIFFERENT, rc 1.

The non-code files have no change since dc289564: `git diff --stat dc289564 HEAD` lists only the 5 code files.

## 4. §21c count, form excluded
- `git diff --numstat 78fc2c7e dce20da2`: 11 files, 89 + 55 = **144**. At dc289564 the count was 134.
- No generated files are in the diff (grep for CUSTODIAN-QUEUE, site/ and lock files: rc 1, no match).

Amendment 2 checks out:
- item 1's figure is 144 = 134 + 10 against the declared 140;
- 144 is inside 150 (item 2);
- the Scope line is unedited and no file was added (item 3);
- the class is 6;
- the worker report 2 path it cites is tracked on main.

## 5. PR body (`gh pr view 203`, rc 0; headRefOid dce20da2c21391e6b1aca57b6ffbb58f4465c545)
- **D1 fixed in the body.** It no longer says Export moved. It says Export sits in the Inspector's Layer tab, that the build had wrongly named the Layers region, and that fix round 1 put it back.
- **D6 fixed in the body.** It says the bump of `geometry-types-beyond-polygons` to generation 8 is "the bump §15 makes on any amendment, not a Scope addition". That is the obligatory amendment bump in substance, per `AUTONOMY.md:47`, though the word "obligatory" is not used.
- Size (144, Amendment 2) and head (dce20da2) match.
- The fix commit's message carries no outside reference and is signed off.

## 6. Governance checks at the head (D:/wt/docb)

| Command | rc | Result |
|---|---|---|
| `node scripts/plan/verify-cites.mjs` | 0 | PASS, 1663 files; 53 loose references advised, none in this diff |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS: 121 checked, 90 verified, 30 baselined, 1 advisory, 0 hash-reference errors |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS, 533 claims |
| `node scripts/plan/verify.mjs` | 0 | PASS |
| `node scripts/plan/queue.mjs --check` | 0 | current |
| `node scripts/plan/site.mjs --check` | 0 | current |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | 0 | 457 pass, 0 fail, 0 cancelled |

vitest was not re-run, as briefed.

**`gh pr checks 203`** (rc 0). All 10 lines printed, all pass, none pending:
- L1 portable correctness · cargo test --workspace (ubuntu-24.04)
- cargo test --workspace (windows-latest)
- cfg boundary (PORTABILITY R2)
- every commit is signed off
- no profile path in the range
- tauri build (NSIS) ×2
- test · verify:plan · queue/site drift
- typecheck · build · vitest · cargo test ×2

**Runs at the head.** `gh run list --commit dce20da2…` (rc 0) shows six runs, all completed with success and all at dce20da2c21391e6b1aca57b6ffbb58f4465c545:
- 38084297585 DCO sign-off, pull_request;
- 38084297502 Exposure scan, pull_request;
- 38084297559 Governance CI, pull_request;
- 38084297547 Product CI — shell, pull_request;
- 38084297484 Product CI — Rust workspace, pull_request;
- 38084293763 Product CI — shell, push.

There are 10 lines against gate 1's 14 because only the shell workflow ran on push for this fix commit.

## Documentation (must be fixed in this PR before the merge; no re-gate)
- **G2-D1. A changed line is 140 columns wide.**
  - Location: `frontends/shell/src/console/ConsolePanel.tsx:23` (head). It begins ` * (\`layout/contributions.ts\`'s \`ACTIVITY_TABS\`). Mounted unconditionally…`.
  - The D4/D5 fix reflowed the paragraph but lengthened this line instead of wrapping it. It was already 111 columns at dc289564, which gate 1's D5 should have listed.
  - It is the same defect as D5: neighbouring lines wrap at about 100 columns.
- **G2-D2. "that stacked layout" no longer has an antecedent** (`ConsolePanel.tsx:21-22`).
  - Removing D4's attribution left "`styles.css`'s `.console-panel` comment is that stacked layout's history" with no earlier mention of a stacked layout in the comment.
  - The statement is not untrue: styles.css:901 opens the `.console-panel` comment with the HISTORY (milestone 1) line.
  - Suggested wording: "the stacked layout milestone 1 retired".
- **G2-D3. The PR body still says string 6's phrase "is copied by script from entry 45's RULED block".**
  - The comment now discloses that the RULED block's line break was collapsed. The body should say the same or drop "copied".
  - This is Documentation, not Correctness, because the body uses no quotation marks.

Files:
- D:/wt/docb/frontends/shell/src/console/ConsolePanel.tsx
- D:/wt/docb/frontends/shell/src/residency/residencyStatus.ts
- D:/wt/docb/frontends/shell/src/publish/PublishPanel.tsx
- C:/dev/spatial-ide/frontends/shell/SHELL-STALE-FRAME-AND-LAYOUT-COMMENTS-PREREGISTRATION.md
