*Custodian's filing note (2026-10-19): the worker-high's report for `shell-migration-milestone-3` PR A, in C:/dev/wt/mm3a from the code base 564aadae; the head 7e4ea32a0ccef474b8b05ed582271a4baa24101f, pushed. The run 2026-10-19T17:39:06Z to 18:19:56Z by its transcript (Read 11, Bash 119, Write 9); its one SubagentHandback call, at 18:19:55Z; the npm ci runs, the shared hold around npm run verify, the mutation runs, the commits and the push are each in the transcript. Extracted by script; 0 path:line cite(s) de-rooted; one final newline added if absent; nothing else changed. The e2e suites are the custodian's.*

---

REPORT: node:shell-migration-milestone-3@g6, PR A built and published

Head 7e4ea32a0ccef474b8b05ed582271a4baa24101f, branch cut/shell-migration-milestone-3-pr-a, pushed (ordinary update, upstream set, rc 0). Final `git status --porcelain --untracked-files=all` prints nothing. Base 564aadae556a39c2f3a0f567730ec58e4cfe0439 confirmed at start (fetch rc 0, porcelain empty). The e2e suites were not run.

## Commits, by step (in the order I chose)
1. 82db0dcd (step 1): registry entries command.focus (Mod+K), dataset.open, layer.revealExport; every entry gains `command` and `takes`; `matchCommandOpener`; `command/commandDraft.ts`; `command/commandConstants.ts`; tests UC1, UC2, UC8, UC9, UC10.
2. fa671554 (1b): UC2 test fix (see differences, item 3).
3. 22a701b4 (1c): recorded mutations of UC1, UC2, UC8, UC9, UC10, observed at fa671554.
4. 082ebd27 (step 2): `CommandBar.tsx`; StudioLayout (bar after `.app-header`, availability, one `runAction` with an arm per entry, bare `/` via `matchCommandOpener`, `leaveBar`); AdmissionPanel `requestPick` handle; PublishPanel `reveal` handle; App wiring; styles; `App.command.test.tsx` (harness copied from App.selection.test.tsx; `recordStep` logged and refusable; `fitToBounds` and `fitToBbox` counted; `skp/dialog` counted).
5. 7831aec1 (3a): Escape from the bar with nothing held before goes to the map region, not `document.body`; RC10 gains that case.
6. a681f471 (3b): `e2e/command-bar.mjs`, the `e2e:command-bar` script line, the README entry for that suite only.
7. 6f83d537 (3c): RC-SLASH's Shift assertion gets a message.
8. d24a98e0 (3d): recorded mutations of RC1, RC2, RC8, RC8b, RC9, RC10, RC13, RC15, RC17, RC-SLASH, observed at 6f83d537. It also corrects three expected messages in the e2e header.
9. 7e4ea32a (3e): comment indentation only.

## Tests (id, name, commit that adds it)
- UC1 and UC2 in `src/command/commandDraft.test.ts`: 82db0dcd; UC2 revised in fa671554.
- UC9 in `src/command/commandBoundary.test.ts`: 82db0dcd.
- UC8 in `src/layout/actionRegistry.test.ts`: 82db0dcd. It has two parts: the edited exact-id test, now "holds exactly the eleven ids …", and the new "UC8: Mod+K maps to command.focus (Meta on macOS), and every chord is unique". The declared edit to the unbound-chord test changes `ctrl("k")` to `ctrl("x")` and keeps the name.
- UC10 in the same file: 82db0dcd.
- `src/App.command.test.tsx`: 082ebd27 for RC1, RC2, RC8, RC8 case b, RC9, RC10, RC13, RC15, RC17 and RC-SLASH. The RC10 map-region case came in 7831aec1 and the RC-SLASH message in 6f83d537.

Recorded mutations, each applied alone, test run, failure read by name, reverted with porcelain clean:
- At fa6715541ccdef4285503a2b9bd59ec9a44943dc (recorded in 22a701b4):
  - UC1: case-sensitive `contains`. Fails on the ZOOM search: expected [] to equal [layer.zoomToLayer, selection.zoomTo].
  - UC2: Tab sets `open: true` after completing. Fails: "a second Tab leaves: {"draft":"/lay","open":true,"active":null}: expected [ true, 'none' ] to deeply equal [ false, 'none' ]".
  - UC8 exact-id: delete the `dataset.open` entry. Fails: the sorted ids lack dataset.open.
  - UC8 Mod+K: give `command.focus` the chord J. Fails: expected [null,null,null] to equal ['command.focus',…]; the existing "shortcuts are unique" test also fails (expected 3 to be 4).
  - UC9: `import "../skp/client"` in commandDraft.ts. Fails naming command/commandDraft.ts imports ../skp/client.
  - UC10: match on `event.code === "Slash"`. Fails: expected [true,true,false,false] to equal [true,true,true,true]; the Shift+Digit7 row is the third.
- At 6f83d5377e3592760d0286b82f45415b11c278ee (recorded in d24a98e0):
  - RC1: delete `barRef.current?.take();`. Fails "the bar's input holds the focus".
  - RC2: the bar's `run` is a copy that dispatches without recording. Fails "/layers: the same row: expected [] to deeply equal ['layout.toggleLayers']".
  - RC8: `onOpenDataset` is a no-op. Fails "the picker is called once: expected 0 to be 1".
  - RC8 case b: `onOpenDataset` answers busy while `asking`. Fails "the picker is called once more…: expected 1 to be 2".
  - RC9: `reveal()` also calls `handlePublishClick()`. Fails "nothing is exported: expected 1 to be 0".
  - RC10: delete `back?.focus();`. Fails "nothing held it before: the map region".
  - RC13: `aria-activedescendant={undefined}`. Fails: expected null to be 'command-list-option-0'.
  - RC15: the text-field guard skips `.command-bar`. Fails "neither key is prevented, so both are typed: expected [false,false] to equal [true,true]".
  - RC-SLASH: `matchCommandOpener` ignores Shift. Fails "Shift+7 on a layout where / needs Shift: the default is prevented: expected true to be false".
  - RC17 (a): `onClearSelection` is a copy that records no row. Fails: expected [0, []] to equal [0, ['selection.clear']].
  - RC17 (b): delete `selectionAvailable === true && ` in both cases. Fails: expected [null,null] to equal ['true','true'].
- `verify-mutation` was run only as a heuristic self-check (rc 0, 16 new tests each name a mutation). It is not an observation.

E2E rows' mutations are written down, not run, in the header of `frontends/shell/e2e/command-bar.mjs`. Each text below is found exactly once at the head (checked by script):
- E-CTRLK, in StudioLayout.tsx: replace `if (region !== undefined) apply({ kind: "toggle", region });` with `if (region !== undefined) dispatch({ kind: "toggle", region });`. Expected: step E-CTRLK, "E-CTRLK: 0 layout.toggleLayers rows were recorded, expected exactly 1".
- E-SEARCH, in commandDraft.ts: replace `contains(e.label, text) || contains(e.command ?? "", text)` with `contains(e.command ?? "", text)`. Expected: "E-SEARCH: the text to lay lists 0 options ([]), expected the one entry Zoom to layer".
- E-HELP, in commandDraft.ts: replace `registry.filter((e) => contains(e.label, query) || (e.command !== null && contains(e.command, query)))` with `registry.filter((e) => e.chord !== null && (contains(e.label, query) || (e.command !== null && contains(e.command, query))))`. Expected: "E-HELP: ? lists 4 options, expected 11".
- E-BARFOCUS, in commandDraft.ts: replace `if (key.shiftKey || !state.open || count === 0) return none;` with `return { pos, effect: none.effect, preventDefault: true };`. Expected: "E-BARFOCUS: Tab with no list open left the bar's input holding the focus". E-CTRLK also fails, on its Tab completion.
- E-REVEAL, in PublishPanel.tsx: replace `reveal() { if (!expanded)` with `reveal() { handlePublishClick(); if (!expanded)`. Expected: "E-REVEAL: the approval prompt (.publish-dialog) is showing", or "E-REVEAL: timed out after 60000ms" while the native picker stands.
- E-SLASH, in actionRegistry.ts: replace `return event.key === "/" && !isEditable(focus);` with `return event.key === "/";`. Expected: "E-SLASH: the focus left the Filter section's input when / was typed in it".

## §7: counting command output and figures
Command: `git diff --numstat 564aadae…HEAD -- frontends/shell ':(exclude)…PREREGISTRATION.md' ':(exclude)…MANUAL-WALKTHROUGH.md' ':(exclude)frontends/shell/e2e/README.md'`. Insertions, deletions, file:
```
354 0 e2e/command-bar.mjs        1 0 package.json              422 0 src/App.command.test.tsx
12 1 src/App.tsx                 13 3 src/admission/AdmissionPanel.tsx
194 0 src/command/CommandBar.tsx  50 0 src/command/commandBoundary.test.ts
5 0 src/command/commandConstants.ts  112 0 src/command/commandDraft.test.ts  124 0 src/command/commandDraft.ts
80 5 src/layout/StudioLayout.tsx  37 3 src/layout/actionRegistry.test.ts  33 11 src/layout/actionRegistry.ts
21 5 src/publish/PublishPanel.tsx  70 0 src/styles.css
```
The total is 1,556. The excluded e2e README is +14.

| Group | Figure | Ceiling |
|---|---|---|
| A-P | 578 | 902 |
| A-T | 624 | 1,080 |
| A-E | 354 | 460 |

A-P by file (sum 573; commandConstants.ts adds 5):
- commandDraft.ts 124 (≤220)
- CommandBar.tsx 194 (≤300)
- actionRegistry.ts 44 (≤60)
- StudioLayout.tsx 85 (≤90)
- App.tsx 13 (≤80)
- AdmissionPanel.tsx 16 (≤20)
- PublishPanel.tsx 26 (≤30)
- styles.css 70 (≤100)
- package.json 1 (≤2)
- commandConstants.ts 5, which has no A-P ceiling of its own; it sits inside the group total.

A-T by file:
- commandDraft.test.ts 112 (≤450)
- actionRegistry.test.ts 40 (≤50)
- commandBoundary.test.ts 50 (≤70)
- App.command.test.tsx 422 (≤500)
- App.layout.test.tsx 0

A-E by file: command-bar.mjs 354 (≤380); layout.mjs 0. No overrun, so no class 8.

## User-visible strings added (byte-copied, for the AB11 sight)
CommandBar.tsx:
- L24 `[P6 placeholder] not available`
- L25 `[P6 placeholder] That command is not available right now.`
- L26 `[P6 placeholder] A file is already being opened.`
- L27 `[P6 placeholder] Type a command, or ? for the list.`
- L28 `[P6 placeholder] Choose a command with the arrow keys, or press Tab to complete its name.`
- L29 `[P6 placeholder] No command has that name. Type ? for the list.`
- L30 `[P6 placeholder] Nothing matches that.`
- L142 aria-label `[P6 placeholder] Command bar`
- L143 placeholder `[P6 placeholder] Type / for commands or ? for help`

actionRegistry.ts, shown in the list and unmarked (see differences, item 9):
- labels: L67 `Command bar`, L68 `Open dataset`, L69 `Export`
- words, L59-66 and L68-69: `layers`, `inspector`, `activity`, `zoom-to-layer`, `navigate`, `select`, `zoom-to-selection`, `clear-selection`, `open`, `export` (`command.focus` has no word)
- shown with a leading `/`.

## Differences from the form or brief
1. `resolveDraft` result shapes. `help` and `commands`/`search` carry `candidates: {entry, available}[]`, and `run` carries `available`. `unresolved.reason` is only "unknown-command" in PR A. A `/word` followed by whitespace gives unknown-command. The `filter` result and `filter-empty` are PR B's. `takes: "condition"` is in the type with no PR A entry; a synthetic-registry test shows such a word does not run on its own.
2. Tab completes only with the list open (an active option, or the only option). The form's "or exactly one candidate" is read as applying to an open list. With the list closed, Tab is never intercepted. This is what makes E-BARFOCUS ("no list open, Tab leaves") and "a second Tab always leaves" hold.
3. The form's UC2 mutation could not fail as first built. Every completion is an exact word, which resolves to `run` with no list, so a reopened list never offered a candidate. fa671554 steps the second key from the worst case, the list still offering what it offered before; the mutation then fails by name.
4. `dataset.open` is always available when App passes `onOpenDataset`. The busy line comes from `requestPick()` answering "busy" (RC8 and Amendment 3 item 11). §2.2's "unavailable while an open is in flight" would never show the busy line.
5. After Enter on a draft that does not resolve, the list closes and the note shows. The two never show together; ArrowDown or typing brings the list back. The list and the note are both `position: fixed` below the top bar.
6. In the keydown listener's bare-key branch I introduced a `holder` variable shared with the `/` check. `matchToolKey` receives the same value as before. Amendment 3 item 6 says that branch is not edited, so this is disclosed.
7. Setup beyond the brief: `npm ci` in `renderer/bundle-viewer`, then `node scripts/buildViewerFirst.mjs` and `npm run generate:notice`. `npm run typecheck` needs them, and the App render tests import the generated NOTICE. The outputs are gitignored; no tracked file or dependency changed.
8. `commandConstants.ts` has no A-P ceiling in §7 (5 lines, inside the group total).
9. The three new registry labels and the ten words are not marked "[P6 placeholder]". The existing labels are not marked either; they are listed above for the AB11 sight.
10. The e2e suite counts the Layers row by the registry's own statement text, read through `loadShellModule("src/console/surfaceRegistry.ts")`, so a P6 rewording does not break it. I checked that this module and `actionRegistry.ts` load under the loader (11 entries, class-C statement returned). Nothing else in the suite was run.

## Product callers (grep checked)
- `matchCommandOpener`: StudioLayout listener.
- `resolveDraft`, `commandBarKey`, `completionOf`, `typeDraft`: CommandBar.
- `requestPick`: App `onOpenDataset`.
- `reveal`: App `onRevealExport`.
- `onZoomToSelection`, `onClearSelection`, `selectionAvailable`, `onOpenDataset`, `onRevealExport`: passed by App, read in StudioLayout.
- `COMMAND_LIST_MAX_HEIGHT_PX`: the list's inline style.

## Commands and exit codes
- `git fetch origin`: 0.
- `npm ci` in frontends/shell: 0; in renderer/bundle-viewer: 0.
- `node scripts/buildViewerFirst.mjs`: 0.
- `npm run generate:notice`: 1 once, before the viewer build existed; 0 after.
- `npx tsc --noEmit`: 0 each time run.
- Targeted `npx vitest run …`: 0, except one earlier run (rc 1) before NOTICE.txt existed. An unbuilt full `npx vitest run` gave 7 failed tests in 4 notices test files, all NOTICE-bootstrap, unrelated.
- Mutation runs: rc 1 each, as expected; reverts rc 0.
- `git commit -s -F …`: 0 for all nine commits.
- Inside `hold shared` (granted, released): `npm run verify` rc 0, 98 test files and 1,368 tests passed.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: 0 (483 pass).
- `verify-cites.mjs`: 0. `verify-quotes.mjs`: 0. `verify-test-claims.mjs`: 0. `verify.mjs`: 0.
- `verify-mutation.mjs --base 564aadae`: 0.
- `git push -u origin cut/shell-migration-milestone-3-pr-a`: 0.

## The four failure classes, checked
- Cross-module code: no module boundary crossed. Nothing under skp/, streaming/, residency/, canvas/, src-tauri, protocol, kernel or engine. UC9 proves src/command/ imports none of those four. The new handles are mine on both sides.
- Completion claims: every "done" above points at a named test, its recorded failure, or a command rc. The e2e suite is not run, and the e2e mutations are written down only.
- User-facing messages: every message describes behaviour at this commit (unavailable entry, busy open, unresolved draft, no match). They state shell facts and no consequence.
- Required tests: each reaches its assertion. RC8 case b reaches the ask through a standing export run (pending prepare), asserts the second picker call, and asserts `openDataset` stayed at 1. RC9 asserts the disabled-button fallback to the disclosure, then focus on `.publish-open` after `onViewShown`.

## Model
Sonnet 5.5 (claude-sonnet-5-5), as the harness reports. No override, no context handoff.
