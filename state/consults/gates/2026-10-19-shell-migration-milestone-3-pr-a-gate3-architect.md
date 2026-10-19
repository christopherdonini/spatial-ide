Reviewed: PR #233 at 2fa7c8d09df2e8f21370c1bf68b23213a25615a0 (base 564aadae; gate 3, architect, scoped to round 2)
Verdict: PASS WITH NOTES
Branch: cut/shell-migration-milestone-3-pr-a @ 2fa7c8d09df2e8f21370c1bf68b23213a25615a0

The verdict is PASS WITH NOTES. Round 2 fixes gate 2's two Correctness findings and its Evidence finding, and I found nothing new under Correctness or Evidence. Three Documentation findings remain. They must be fixed before the merge and need no re-gate.

**What I could not run.** I have no shell, so none of these ran:
- `git fetch`, `gh pr view 233` and `git diff 621cd1f3..2fa7c8d0`;
- the tests and the verify scripts;
- a recomputation of the sha256 that Amendment 7 gives for its record (de22c15f…91db @ 4e413112);
- a check that C:/dev/wt/mm3a is at the head and clean. I took the brief's word for that.

I read the head's files in C:/dev/wt/mm3a and the form on main (1dd20082). I counted the anchors with Grep, in the worktree. Everything below about how the code behaves comes from reading it; I executed nothing. I could not read the PR body, so R2's D5 is unverified.

## Correctness
None.

## Evidence
None.

## Documentation (must be fixed before the merge; no re-gate; none of these sentences is the human's wording, so the worker applies the words and the PR body lists them)

**D1. The MUTATIONS sentence is stale.** frontends/shell/e2e/command-bar.mjs:12 still names the 7e4ea32a run and "the head that adds this file". That run covered six of the eight mutations, and E-BARFOCUS ran on its earlier anchor. Words: under "Words asked of you", (i).

**D2. E-SEARCH-c's prediction line is stale.** frontends/shell/e2e/command-bar.mjs:20 still calls the outcome a prediction, but it was observed at 2fa7c8d0.
- In :20, replace `Expected, a prediction until the custodian observes it: step E-SEARCH fails,` with `Predicted, and observed at 2fa7c8d0: step E-SEARCH fails,`.
- Clause check:
  - "observed at 2fa7c8d0": the round 2 e2e record, :20 (`mut-E-SEARCH-c: rc=1`, reverted-clean-at=2fa7c8d0).
  - The quoted message that follows: it is byte-equal to the record's failing line at :58 and to the throw at command-bar.mjs:172.

**D3. The correction round has no superseded index** (round 12, item (e)). Amendment 7 item 1 supersedes §4's E-BARFOCUS row, and item 2 corrects Amendment 6's references. Amendment 7 is on main, so it is not edited. The PR's closing amendment carries the index, as references only:
- §4's E-BARFOCUS row: superseded by Amendment 7 item 1.
- Amendment 6 item 2's report reference, item 4's head, and its preamble's hash rev: superseded by Amendment 7 item 2.

**Outside this round, for the custodian, not a finding here.** In the record, the E-REVEAL mutation also fails E-SLASH (round 2 e2e record :76-78). command-bar.mjs:27 does not predict that second failure.

## Check 1: gate 2's findings at the head

| Finding | Status | Where |
|---|---|---|
| A2 C1 (the splitter) | resolved | CommandBar.tsx:110 runs the action inside `flushSync`. The splitter carries `hidden` itself (regionParts.tsx:156), so `leaveBar`'s `closest("[hidden]")` at StudioLayout.tsx:206 matches it. RC10 case c is at App.command.test.tsx:354-363, and its mutation was observed at 0e9944ea (:351-353). |
| A2 C2 (close, reopen, Escape) | resolved | Round 1's clear is gone, and `apply` is at StudioLayout.tsx:168-178. RC10 case d is at App.command.test.tsx:368-379, and its mutation was observed at 0e9944ea (:365-367). |
| A2 E1 | resolved | See check 4. |
| A2 D1 | not yet applied | D1 above; words under (i). |
| A2 D2 | resolved; byte-equal to my words | command-bar.mjs:18 |
| A2 D3 | not yet applied | Words under (ii). |
| A2 D4 | resolved | Amendment 7 item 1, which also carries R2's D4 sentence. README.md:813 has R2's D4 words. |
| A2 D5 | resolved | Amendment 7 item 2. The round 0 report's Differences item 1 is at its :114. 621cd1f3 is written in full. afea0ff2 is the main commit that filed the round 1 record. |
| A2 note for PR B | carried | Amendment 7 item 5; still true at commandDraft.ts:117-119. |
| R2 C1 | resolved | as A2 C1 and C2 |
| R2 D1 and D3 | superseded | by (i) and (ii) below |
| R2 D2 | resolved | through A2 D2 (command-bar.mjs:18) |
| R2 D4 | resolved | README.md:813; Amendment 7 item 1 |
| R2 D5 | not verified | I could not read the PR body. |

## Check 2: `flushSync` against §2.3's Escape and Running rules

`applyEntry` (CommandBar.tsx:106-114) is called only from the key handler (:126, :128) and from an option's click (:181). Both are event handlers, so `flushSync` is never called during a render or an effect (React 18.3, package.json:54-55). The import does not break UC9: commandBoundary forbids imports only from `skp/`, `streaming/`, `residency/` and `canvas/`.

**A field in a closed region.** The held field is inside the region. The toggle commits inside `flushSync`, and `leave` runs after it. `closest("[hidden]")` then matches the region, so the focus goes to the map. That is Escape's rule. RC10 case b is at App.command.test.tsx:340-349.

**The region's splitter.** After the commit the splitter itself carries `hidden`, so the focus goes to the map. RC10 case c covers it. Before the commit, `apply`'s own `holdsFocus` check (StudioLayout.tsx:171-174) is not triggered, because the bar has the focus. That is correct.

**A region closed and opened again.** Ctrl+I in the bar returns early at CommandBar.tsx:117, and the window listener runs `runAction` without `flushSync`; nothing clears `heldRef`. On Escape the field is visible again, so it gets the focus back. RC10 case d covers it. A bar `/inspector` that reopens the region of a held field also returns the focus to the field, which is the same rule.

**`/open`.** `requestPick` (AdmissionPanel.tsx:316) returns synchronously, and `handlePick` sets no state before its first `await`. So `flushSync` changes no timing here: "done" leaves by Escape's rule, and "busy" shows the note and keeps the focus. Unchanged from round 1.

**`/export`.** The two `apply` calls and `reveal` all commit inside `flushSync`. The focus effect at PublishPanel.tsx:376-380 then finds the Export button inside an Inspector that is already showing, and the "moved-focus" outcome skips `leave`. RC9 (App.command.test.tsx:304-311) and the E-REVEAL step pass at the head (round 2 e2e record :14).

Verdict on check 2: held on all five paths.

## Check 3: Amendment 7, items 1 to 7

1. **Item 1** holds against commandDraft.ts:107-110: with the list closed and a candidate count other than 1, Tab is not intercepted. The E-BARFOCUS step runs from an empty bar (README.md:813).
2. **Item 2** holds; see A2 D5 above. It is one sentence, within the record cap.
3. **Item 3** holds: CommandBar.tsx:109-110, StudioLayout.tsx:168-178, and the round 2 report's mutation runs at 0e9944ea.
4. **Item 4** holds: the record's :20 and :58, and command-bar.mjs:172. Its discharge claim resolves (see check 4).
5. **Item 5** holds; see A2's note above.
6. **Item 6** is consistent with this gate.
7. **Item 7** holds: generation 8 matches the tag.

No item is marked as verbatim. Its preamble cites 4e413112, a commit on main. I could not recompute the hash.

## Check 4: E-SEARCH-c against §4 and §8 item 21

The mutation is written in the header at command-bar.mjs:19-20. Its anchor is found once (styles.css:57-58). It was applied alone, the run returned rc=1, the failing line was recorded with its commit (record :20 and :58), and it was reverted clean at 2fa7c8d0. The failing line is the `elementFromPoint` throw at :172, which comes before the top check at :173. So the assertion added by Amendment 3 item 2 (C6) now has an observed failing mutation: §4 is met, and §8 item 21 no longer applies. The only open part is header :20's text, which is D2 above.

**Anchor sweep at the head.** All eight from-texts are found exactly once in their files:
- StudioLayout.tsx;
- commandDraft.ts, three anchors;
- styles.css, two anchors;
- PublishPanel.tsx;
- actionRegistry.ts.

**§7.** These are the worker's counts; I could not rerun the numstat. StudioLayout.tsx is 85 of 90, CommandBar.tsx 195 of 300, App.command.test.tsx 466 of 500 and command-bar.mjs 357 of 380. A-P is 582 of 902, A-T 685 of 1,080 and A-E 357 of 460. There is no overrun.

## Words asked of you

Neither sentence is the human's wording: the header was written by the worker, and README.md:811 says the entry is not the human's wording. The worker applies both sets of words, with no re-gate, and the PR body lists them.

**(i) frontends/shell/e2e/command-bar.mjs:12.** Replace the whole line with:

`// MUTATIONS (section 4: every mutation is observed). Written down by the worker. Each is a replacement of one exact text, found exactly once at 2fa7c8d09df2e8f21370c1bf68b23213a25615a0, and each is to be reverted after it is observed. The custodian ran each alone at that commit, and each failed its named step (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-2-e2e-custodian-runs.md, which carries each failing line):`

Clause check:
- **"found exactly once at 2fa7c8d0":** the round 2 record's preamble (:3) checked each anchor once in its file at the head, and my Grep found all eight at count 1. The words name a commit, so they stay true after the docs-only commit that applies them. No anchor is in a file that commit touches.
- **"ran each alone at that commit":** record :17-24, eight `mut-` rows, each `reverted-clean-at=2fa7c8d0`; "applied alone" is at :32.
- **"each failed its named step":**
  - E-CTRLK :40;
  - E-SEARCH :46;
  - E-SEARCH-b :52, which fails step E-SEARCH;
  - E-SEARCH-c :58, which fails step E-SEARCH;
  - E-HELP :64;
  - E-BARFOCUS :71;
  - E-REVEAL :77;
  - E-SLASH :84.
- **"which carries each failing line":** the record's section "The mutation runs' failing lines" (:35-85).
- The earlier runs are left out on purpose, under the record cap: the latest record proves all eight, and :18 keeps its own reference to the 621cd1f3 observation.

**(ii) frontends/shell/e2e/README.md:817, the last sentence.** Replace it with:

`Each step's mutation is in the file's header, with the exact text it replaces; the custodian ran each alone at 2fa7c8d0, and each failed its named step, recorded in state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-2-e2e-custodian-runs.md.`

Clause check: the same as (i), for "ran each alone", "each failed its named step" and the record. "Is in the file's header, with the exact text it replaces" holds at command-bar.mjs:13-29: all eight entries, each with its from-text and to-text.

Files read:
- C:/dev/spatial-ide/state/consults/gates/2026-10-19-shell-migration-milestone-3-pr-a-gate2-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-19-shell-migration-milestone-3-pr-a-gate2-reviewer.md
- C:/dev/spatial-ide/state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-2-worker-report.md
- C:/dev/spatial-ide/state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-2-e2e-custodian-runs.md
- C:/dev/spatial-ide/state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-1-e2e-custodian-runs.md
- C:/dev/spatial-ide/state/consults/2026-10-19-shell-migration-milestone-3-pr-a-e2e-custodian-runs.md
- C:/dev/spatial-ide/state/consults/2026-10-19-shell-migration-milestone-3-pr-a-worker-report.md
- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md (§2.3, §4, §7, §8, Amendments 1, 6 and 7)
- C:/dev/wt/mm3a/frontends/shell/src/command/CommandBar.tsx
- C:/dev/wt/mm3a/frontends/shell/src/command/commandDraft.ts
- C:/dev/wt/mm3a/frontends/shell/src/layout/StudioLayout.tsx
- C:/dev/wt/mm3a/frontends/shell/src/layout/regionParts.tsx
- C:/dev/wt/mm3a/frontends/shell/src/App.command.test.tsx
- C:/dev/wt/mm3a/frontends/shell/src/admission/AdmissionPanel.tsx
- C:/dev/wt/mm3a/frontends/shell/src/publish/PublishPanel.tsx
- C:/dev/wt/mm3a/frontends/shell/src/styles.css
- C:/dev/wt/mm3a/frontends/shell/src/layout/actionRegistry.ts
- C:/dev/wt/mm3a/frontends/shell/package.json
- C:/dev/wt/mm3a/frontends/shell/e2e/command-bar.mjs
- C:/dev/wt/mm3a/frontends/shell/e2e/README.md
