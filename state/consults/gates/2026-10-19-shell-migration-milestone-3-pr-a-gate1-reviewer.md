Reviewed: PR #233 at 7e4ea32a0ccef474b8b05ed582271a4baa24101f (base 564aadae; gate 1, reviewer)
Branch and commit: cut/shell-migration-milestone-3-pr-a @ 7e4ea32a0ccef474b8b05ed582271a4baa24101f
Verdict: FAIL

The PR fails on one Correctness finding and one Evidence finding. Every check of the brief that could be run passed. The five unit and render mutations reproduce, the e2e record matches its artifacts, §7 is within every ceiling, and the Amendment 5 pins recompute.

## Correctness (blocks)

**C1. A command run from the bar that closes a region puts the focus back inside that region, not on the map.**
- Where: frontends/shell/src/command/CommandBar.tsx:112 calls `leave()` straight after `run(id)` returns "done". frontends/shell/src/layout/StudioLayout.tsx:204-208 (`leaveBar`) checks `held.closest("[hidden]")` at that moment, before React has committed the toggle that `runAction` started at StudioLayout.tsx:213. So the held element still looks visible, and it gets the focus back. The region is hidden on the next commit, and the focus is left inside it.
- `apply` (StudioLayout.tsx:168-178) normally moves the focus to the map when a region that holds the focus is closed. That rule does not fire here, because at toggle time the focus is in the bar.
- Rule broken: §2.3, Running ("returns focus as Escape does") and Escape ("If that element is gone or inside a closed region, focus goes to the map region"). The doc comment of `leaveBar` at StudioLayout.tsx:203 says the same and is untrue on this path.
- Ordinary use reaches it: put the focus in the Filter input, press Ctrl+K, type `/inspector`, press Enter. The same happens with `/layers` from a field in Layers, or `/activity` from a field in Activity.
- Proof: in a temporary copy of App.command.test.tsx in my gate worktree (deleted afterwards), that sequence logged `PROBE inspector hidden: true active: FIELD` and failed with `expected <input type="text" …(3)></input> to be <main id="region-map" …(3)>…(1)</main>`. vitest rc=1.
- RC10 does not catch it. It closes the region by chord before Escape, so the check runs after the commit.
- Fix: in `apply`, when a toggle closes a region that contains `heldRef.current`, clear `heldRef.current` so `leaveBar` falls to the map. Alternatively, defer `leave()` until after the commit.
- Test to add: an RC10 case or new row where the focus is in the Filter input, then Ctrl+K, `/inspector`, Enter, and the focus must be on `#region-map`. Record its mutation (drop the clear; it fails on the focus) as §4 requires.

## Evidence (blocks)

**E1. Preregistered mutation E-SEARCH-b was never written down or run.**
- The form's Amendment 3, item 2 (C6, "The test") adds the `elementFromPoint` assertion to E-SEARCH together with "Mutation E-SEARCH-b: draw `.command-list` in normal flow; it fails on `elementFromPoint`".
- The assertion is at e2e/command-bar.mjs:161-170. The header at e2e/command-bar.mjs:12-26 lists six mutations and leaves E-SEARCH-b out. The custodian's mm3a-mut.mjs has six entries, and the e2e record has no E-SEARCH-b run.
- `git grep "E-SEARCH-b"` finds only the form, on both the branch and main.
- Rules broken: §4 ("Every mutation is observed") and §8 item 21.
- Fix: write E-SEARCH-b into the header as an exact replacement that is found once. For example, in styles.css change the `.command-list, .command-note` rule's `position: fixed;`, with an anchor that is unique in the file. The custodian then runs it alone at the new head and records the failing line.

## Documentation (must be fixed before the merge; no re-gate)

None of the sentences below is the human's wording. The worker applies the words and the PR body lists them.

**D1. The comments say the note never sits over the map, but it does while the list is closed.**
- Where: frontends/shell/src/styles.css:1187-1189 ("they exist only while open, so nothing sits over the map when closed") and frontends/shell/src/command/CommandBar.tsx:16-17 ("never over the map while closed").
- The `.command-note` is shown while the list is closed (CommandBar.tsx:108, 110, 130), over the map.
- Replacement for styles.css:1188-1189, from "`position: fixed`" to the end of the comment: "`position: fixed` just below the top bar (`--top-bar-h`), because `.top-bar` clips what overflows it. The list is rendered only while open. The note is rendered only while it holds a line, and the line goes when the draft changes, when the bar handles a key, or when the input loses the focus. Neither is a permanent element over the map. Colours are P6 placeholders. */"
- Replacement for CommandBar.tsx:16-17, from "The list and the" to "while closed.": "The list and the one-line note are `position: fixed` below the top bar (whose `overflow: hidden` would clip them). The list is rendered only while open. The note is rendered only while it holds a line, which goes when the draft changes, when the bar handles a key, or when the input loses the focus."
- Clause check:
  - "the list rendered only while open": `{shown && (` at CommandBar.tsx:169.
  - "the note only while it holds a line": `{note !== null && (` at :164.
  - "goes when the draft changes": `setNote(null)` in onChange at :153, and in the draft-changed branch of :120.
  - "when the bar handles a key": the `step.preventDefault` branch of :120.
  - "when the input loses the focus": onBlur at :160.
  - "fixed below the top bar": styles.css `.command-list, .command-note { position: fixed; top: var(--top-bar-h)`.

**D2. The e2e header claims real keys and a §4 rule that does not exist, and says the mutations were not run.**
- Where: e2e/command-bar.mjs:5-6 says E-SLASH runs "with real keys", but the suite uses CDP `page.keyboard.press` (:72), which its own :9-10 says does not prove real keys. :12 attributes to "section 4" a rule that the e2e mutations are only written down; §4 says every mutation is observed. "NOT RUN" is now stale. e2e/README.md:817 ("those are written down and not run") is stale the same way.
- Replacement for :5-6 from "and E-SLASH": "and E-SLASH, the bare `/` sent by CDP key injection from the map and in the Filter section's input (Amendment 1 item 9; what that injection does not prove is below)."
- Replacement for :12-13 up to "found exactly once": "// MUTATIONS (section 4: every mutation is observed). Written down by the worker; the custodian ran each alone at 7e4ea32a0ccef474b8b05ed582271a4baa24101f and each failed by its named step (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-e2e-custodian-runs.md). Each is a replacement of one exact text, found exactly once …". E-SEARCH-b's entry and its run are added under E1.
- Replacement for README.md:817's last sentence: "Each step's mutation is in the file's header, with the exact text it replaces; the custodian ran each alone at 7e4ea32a, recorded in state/consults/2026-10-19-shell-migration-milestone-3-pr-a-e2e-custodian-runs.md."
- Clause check:
  - "CDP key injection": command-bar.mjs:72.
  - "from the map": `resetBar` focuses `#region-map` (:79) before `press(page, "Slash")` (:272).
  - "in the Filter section's input": :278-279.
  - "each failed by its named step": my check 4 re-derived the six mutation runs from their artifacts. E-REVEAL failed by timeout, which is one of its two named outcomes.

**D3. Departures from the form's text are recorded only in the worker's report, not in the form.**
- The worker's report, Differences items 2, 4 and 1:
  - Tab completes only while the list is open, against §2.3's "or when exactly one candidate exists".
  - `dataset.open` stays available and answers busy, against §2.2's third availability bullet "unavailable while an open is in flight". This follows RC8 and Amendment 3 item 11, which contradict that bullet.
  - The result shapes differ from §2.4.
- Fix: one class 1 amendment, references only, naming those three items of the report against those form passages. The behaviour is correct as built.

## Checks

1. **The whole diff and §8 at the head.** 16 files, +1,542 and −28. No file is outside `frontends/shell` (`git diff --name-only | grep -v '^frontends/shell/'` rc=1). §8 item by item:
   - Items 1, 2, 3, 4 and 9: clean.
   - Items 5, 6, 7 and 13: PR B's.
   - Item 8: every new `runAction` arm calls the handler its button calls. `handleSelectTool` is passed to ToolSwitch (App.tsx:2289), and `handleZoomToSelection` and `handleClearSelection` to the Feature tab (App.tsx:2304-2305). The Open button and `requestPick` share `isOpenInFlight` (AdmissionPanel.tsx:316 and :370).
   - Items 10, 11, 12, 14, 18, 19, 20, 22, 23 and 24: clean (scanned).
   - Item 15: clean.
   - Item 16: the registry's three labels and ten words are unmarked. They are disclosed in the worker's report for the AB11 sight in PR B.
   - Item 17: every new prop and handle has App as its product caller.
   - Item 21: E1.
   - The focus rule of §2.3 fails on the bar-run path: C1.
2. **Five unit and render mutations**, each applied alone in the detached worktree C:/dev/wt/gate233 at the head (now removed):
   - Baseline: 4 files, 50 tests passed, rc=0.
   - UC2 (Tab sets `open: true`): rc=1. "a second Tab leaves: {"draft":"/lay","open":true,"active":null}: expected [ true, 'none' ] to deeply equal [ false, 'none' ]". Reverted: 2 passed, rc=0.
   - UC9 (`import "../skp/client";`): rc=1. "expected [ Array(1) ] to deeply equal []", whose diff shows `"command/commandDraft.ts imports ../skp/client"`. Reverted: 1 passed, rc=0.
   - RC8 case b (`asking ? "busy" : …`): rc=1. "the picker is called once more, as a second click would: expected 1 to be 2". Reverted: 10 passed, rc=0.
   - RC10 (delete `back?.focus();`): rc=1. "nothing held it before: the map region: expected <input …(11)></input> to be <main id="region-map" …(3)>…(1)</main>". Reverted: 10 passed, rc=0.
   - RC-SLASH (`|| event.shiftKey`): rc=1. "Shift+7 on a layout where / needs Shift: the default is prevented: expected true to be false". Reverted: 10 passed, rc=0.
   - After each revert, `git status --porcelain` printed nothing.
3. **The e2e mutations.** My own dry script (`c3-dry.mjs`, reading only) found all six anchors once each at the head, and the file, from-text and to-text of each match the header byte for byte: rc=0. A negative control with one altered character in E-HELP's to-text gave rc=1, so the comparison does detect a difference.
4. **The custodian's e2e record against its artifacts** (`c4-rederive.mjs`), rc=0. No difference found:
   - `summary.txt` is identical to the record's runs block (27 lines), including every rc line: 17 at rc=0, `source-changed-post` at rc=1, and the six mutation runs at rc=1 with diff-lines=2 and reverted clean.
   - The command-bar run's step verdicts (OPEN, E-CTRLK, E-SEARCH, E-HELP, E-BARFOCUS, E-REVEAL, E-SLASH and FIXTURES, all PASS) are identical to the record.
   - The FAIL lines of all six mutation runs are identical to the record.
   - `source-changed-post` has one FAIL, S5d, and its line has the same sha256 in the log and in the record.
   - No suite log contains `unknown-attempt`.
5. **The suites in C:/dev/wt/mm3a.**
   - `npm ci`: rc=0.
   - `npx vitest run src/command src/layout src/App.command.test.tsx`: rc=0, 8 files and 82 tests. The NOTICE generated earlier was already present (gitignored). In gate233 I rebuilt it by the worker's route, with each step rc=0: viewer `npm ci`, `buildViewerFirst.mjs`, `generate:notice`.
   - `npx tsc --noEmit`: rc=0.
   - `node --test` over the three globs: rc=0, 483 passed.
   - `verify.mjs`, `verify-cites.mjs`, `verify-quotes.mjs` and `verify-test-claims.mjs`: rc=0 each. The tools are at the head, 7e4ea32a.
   - `gh pr checks 233`: rc=0, all 8 checks pass.
   - After all this the worktree is clean at the head.
   - No run was heavy, so none was held. The longest was `node --test` at 48 s; each vitest run took 4 s or less.
6. **§7.** The counting command at the head against 564aadae: rc=0, 1,556 lines in total.
   - A-P is 578 of 902. By file: commandDraft.ts 124/220, CommandBar.tsx 194/300, actionRegistry.ts 44/60, StudioLayout.tsx 85/90, App.tsx 13/80, AdmissionPanel.tsx 16/20, PublishPanel.tsx 26/30, styles.css 70/100, package.json 1/2, and commandConstants.ts 5, which has no ceiling of its own.
   - A-T is 624 of 1,080: commandDraft.test.ts 112/450, actionRegistry.test.ts 40/50, commandBoundary.test.ts 50/70, App.command.test.tsx 422/500.
   - A-E is 354 of 460: command-bar.mjs 354/380.
   - No overrun. The README, which the command excludes, is +14 against its 40.
7. **The pins Amendment 5 adds**, recomputed at 564aadae over whole lines with LF bytes:
   - `KNOWN-LIMITATIONS.md:394` gives c22c976f…53eb. It matches, and equals line 390 at b88b1d2f.
   - `KNOWN-LIMITATIONS.md:383` gives ade05ff3…7ade. It matches, and equals line 379 at b88b1d2f.
   - The re-sweep record's sha256 is 08632629…a9b8, which matches. The record and Amendment 5 are on main at e684c775, committed before the worker's run began.

## Commands and exit codes

- `git fetch origin`: 0
- `gh pr view 233`: 0
- `git diff --stat 564aadae...7e4ea32a`: 0
- `git diff` of the changed files and of styles.css, and the full diff written to a file: 0
- mm3a `npm ci`: 0
- mm3a vitest: 0
- mm3a `tsc --noEmit`: 0
- `node --test` over the globs: 0
- `verify.mjs`: 0
- `verify-cites.mjs`: 0
- `verify-quotes.mjs`: 0
- `verify-test-claims.mjs`: 0
- `gh pr checks 233`: 0
- §7 numstat: 0
- `git show` and `sha256sum` for the pins: 0
- `git worktree add --detach C:/dev/wt/gate233`: 0
- gate233 `npm ci` (shell): 0
- gate233 `npm ci` (viewer): 0
- gate233 `buildViewerFirst.mjs`: 0
- gate233 `generate:notice`: 0
- gate233 baseline vitest: 0
- The five mutation runs: 1 each. Each apply: 0. Each revert: 0. Each run after the revert: 0.
- C1 probe vitest: 1. The probe file was deleted, leaving the porcelain empty.
- c3 dry script: 0. Its negative control: 1.
- c4 re-derivation: 0.
- `git grep E-SEARCH-b`: 0 on the branch and 0 on main, each finding only the form.
- S5d line hash comparison: 0.
- `git worktree remove C:/dev/wt/gate233`: 0.
- Final `git status --porcelain` in mm3a: empty, rc 0.

Nothing was committed or pushed, and I took no PR action.
