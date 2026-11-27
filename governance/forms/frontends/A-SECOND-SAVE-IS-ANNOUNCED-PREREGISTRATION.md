# A second save of the project is announced, and something true on the screen differs from the last save's (PLAN node `a-second-save-is-announced`, proposed): preregistration, full form

**Path proposed:** `governance/forms/frontends/A-SECOND-SAVE-IS-ANNOUNCED-PREREGISTRATION.md`. The node id is proposed, and the custodian adds the node.

**Authority** (the advisor's rulings under the human's delegation of 2026-11-13, cited by id and item; none is reproduced, and none is the human's words):
- ADV-2026-11-26-08:
  - item 3 places A, sets its base and its two musts, and makes its OPEN items;
  - item 4 sets the order;
  - item 6 applies as ADV-2026-11-26-15 item 7 changes it.
- ADV-2026-11-26-15 item 4 (no held piece merges into main until the sitting's checkout stands) and item 7 (A does not go into `release/v0.2`).
- ADV-2026-11-26-17 item 1 (this form is the architect's; lead-data's draft is an input).
- ADV-2026-11-26-19, items 2 to 5 and 7 (what may run, and when).
- ADV-2026-11-26-25, items 1 to 12 (OPEN-A1 to OPEN-A8 ruled, the runs, the ceiling, the strings and the merge check), and ADV-2026-11-26-24 items 2 and 5, which its item 9 applies to A.
- **Evidence, not Authority:**
  - the read that found A, `state/consults/2026-11-26-part-ad-findings-a-b-c-architect-read.md`, "Finding A" (sha256 67e7eee89ca2a2d2b9d5b8dfcafca221c2ed261a66b3efe83b8e06851130c25a, as ADV-2026-11-26-08 names it);
  - lead-data's draft, which the custodian files as an input at `state/drafts/a-second-save-is-announced-form-input-lead-data.draft.md`. As handed back it was 31721 bytes, sha256 9d222216d677dd8e791bdcf267698dd3725ffc7807083ec3d7a5ff7ec9a155ec. It was drafted outside lead-data's definition, on the advisor's ruling. Every claim taken from it was read again at the base below.
- **The reuse index.** The custodian ran `node tools/reuse.mjs save status announced` in the read-only reuse clone at 89bbac37. It exited with status 1 and printed, byte for byte as the custodian records it:
  `No prior art recorded for "save status announced". Research it before planning an implementation.`
  This form records the miss. Its research is §0's reading of the code. Nothing is ported, and nothing in the shell formats a clock time today (a search of `frontends/shell/src` for `toLocaleTimeString`, `getHours(`, `Intl.DateTimeFormat` and `toLocaleString(` finds only a byte count in `publish/PublishPanel.tsx`).

**Drafted by:** the architect, on the custodian's brief. I have no Bash, and I ran, built and launched nothing.
- **The code** was read at 7dbf2f3e635db418d4a6cc0c24a66970939eff59. That is a local merge commit that is never pushed: PR A's head 806ad30843269f8012ec1d89f0224703a8078ad7 with PR 365's head 639a96cc25873c99d606b4d75541bd8f3de37543, merged with no conflict. A reader recreates its tree by that merge.
  - Every "line N" below is a line of that tree. It is written in words, not as a `path:line` token, because the commit is not on main. No span hash is pinned. Each is a historical pin, and for the code, the build base recorded under §9a is authoritative.
  - Paths are under `frontends/shell/src/` unless they begin `e2e/` or `MANUAL-WALKTHROUGH.md` (under `frontends/shell/`) or are rooted.
- **The forms and docs** were read at main c28c8cf10a5b616af3ce660d13b1478d90e4ea08: milestone 5's form, the partitioned-ordinal form, the colour-by-refill form, the text-id form and the identity route's form. By the custodian's git, none of the first three changed between c28c8cf1 and a85e0556d7bd3dd57f38f704e70e5709c02d73bb. The others are cited by section only.
- **Quotes** marked verbatim are byte-copied from the Read output, and a sub-line span says so. Everything else is paraphrase.

**Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line.

**Gating: full form, both gates.** The rules at the base:
- `governance/AUTONOMY.md` §21a puts "any property currently under test" under full gating, and this piece changes two such properties:
  - that a second save's notices equal the first save's (C-A6, `App.conditions.test.tsx` line 511);
  - that C-E2's saved line is exactly `SAVED_NOTICE` (`e2e/conditions.mjs` line 134).
- §21c's threshold excludes new user-visible behaviour, and this piece adds some. §7's estimate is also over 150 lines.
- The template's Round 25 additions, item (e): the `Out-of-scope` line at dispatch would name a guarantee as touched, so the full form applies from dispatch.
- ADV-2026-11-26-08 item 3 rules a full form with both gates.
- The form gates are a fresh architect and the reviewer.

**Base:** see §9a. In short, the base is PR A's head at the commit where its reviewer passes its second attempt, once PR A has taken PR 365's head in. PR 366's head joins by a merge commit only if the piece changes `App.tsx`. It does not (ADV-2026-11-26-25 item 2), so PR 366 does not join.

**Merge:**
- Into main, in its turn, after PR A and PR 365 (ADV-2026-11-26-08 item 3). PR 366 does not join (ADV-2026-11-26-25 item 2).
- By a merge commit, never a squash, so that the commits named by the RECORDED MUTATION lines and commit T (§4) stay reachable from main.
- Not into `release/v0.2`. Whether v0.2 carries A stays the human's (ADV-2026-11-26-15 item 7).
- No merge into main until the sitting's checkout stands with its filed start (ADV-2026-11-26-15 item 4), and none while the human's app runs from the main checkout (ADV-2026-11-26-19 item 4).
- If v0.2 goes without A, the KNOWN-LIMITATIONS words for A are the advisor's, in the candidate (ADV-2026-11-26-08 item 6, which ADV-2026-11-26-15 item 7 leaves standing). This piece writes no such words.

## §0. Disclosure

Reasoned from code. Nothing was run, built or launched.

**0.1 What a second save does at the base.**
- **The saver.**
  - A dataset that is already in `saved` gets no picker (`project/saveProject.ts` line 104).
  - A confirmed reply answers the list built at lines 115-121. Its first entry is the constant at line 27, verbatim: `export const SAVED_NOTICE = "The project was saved.";`
  - When the reply's two judgments are the same as the first save's, the list is the same.
  - A click while a save is in flight answers `null` (line 98, sub-line, verbatim: `if (inFlight) return null;`). App then dispatches nothing (`App.tsx` line 2249).
- **App** dispatches one `replaceBatch` on the save-notice route (`App.tsx` lines 2249-2257).
- **The store** ends that route's conditions for the target and generation once, then raises each display (`conditions/conditions.ts` lines 187-203). Each raise mints a new id (line 156, sub-line, verbatim: ``const id = `condition-${state.nextId}`;``) with `occurrences` 1 (line 166). So the second save's conditions have new ids and no S-5 line.
- **The strip.**
  - App renders the top through `ConditionView`, with no key (`App.tsx` line 2541).
  - StudioLayout wraps each slot in a `Fragment` keyed by the slot's own id (`layout/StudioLayout.tsx` lines 388-391).
  - Neither of ConditionView's two roots carries a key (`conditions/ConditionView.tsx` lines 58 and 61). In the strip the root carries the alert role (line 61, sub-line, verbatim: `role={place === "strip" ? "alert" : undefined}`).
  - Paraphrase of React's reconciliation (reasoned, not run): at every level the element has the same type and no key, so the old DOM node is kept. Its class, its role and its text are the same, so nothing is written to it. The strip shows no change, and no alert element is inserted (H0).
- **Problems.** Every row is keyed by the condition's id (`conditions/ProblemsTab.tsx` lines 23 and 27), so a save makes new row elements. No row carries the alert role (milestone 5's form, §2.3's DOM rule).
- **Order.** `ordered` sorts by urgency, then by first raise (`conditions.ts` lines 216-218), and the strip shows the first (lines 221-224).
  - A save's first line is therefore the strip's top only when no condition of a lower urgency number, and none of urgency 3 raised earlier, stands for the open.
  - Ordinary use reaches such older notices: a reopen notice (`App.tsx` line 1267; its route ends only at the next open, `conditions.ts` line 52), or a record notice (`App.tsx` lines 887-895). See OPEN-A6 and §9c.
- **The kernel's reply** carries `project`, `history_mark` and `project_relative` only (`skp/types.ts` lines 365-369). It has no time and no per-save mark, and A adds neither.

**0.2 Who reads the saved line at the base.** I searched `frontends/` for `SAVED_NOTICE`, `The project was saved`, `save-notice` and `e2eSaveProjectToFolder`.
- `project/saveProject.test.ts` lines 64-65, 94-95, 111, 114, 121 and 150.
- `App.save.test.tsx` line 199.
- C-A6, `App.conditions.test.tsx` lines 489-513: lines 499, 501 and 511 assert the words, and line 512 asserts that no occurrence is counted.
- C-E2: `e2e/conditions.mjs` reads `SAVED_NOTICE` from the source by name (lines 76-82), finds it among the notices at line 131, and compares it exactly at lines 134 and 153.
- The walkthrough: AD1 (`MANUAL-WALKTHROUGH.md` line 2030), AE2 (line 2060) and AF3a (line 2086).
- **Not readers:**
  - `e2e/project.mjs` reads S18 by name (lines 372-391) and prints the save notices only in an error message (line 274);
  - `e2e/colour.mjs` (lines 201-202), `e2e/reopen.mjs` and `e2e/second-open.mjs` save through the hook and assert only its answer.
- Whether a test outside Scope holds a strip element across a change of the top was not searched exhaustively (H2).

**0.3 The base is not yet PR A's final head.**
- Milestone 5's Amendment 12 is written before code, and none of its changes stands at 7dbf2f3e:
  - `e2e/conditions.mjs` lines 5, 17, 18 and 155-159 still hold the text that its items 3 and 4 (d) replace;
  - `e2e/README.md` line 929's last sentence is item 4 (f)'s Old text;
  - a search of `frontends/shell` finds no C-U6b and no N8-G.
- PR A's remaining work lands these. A's build base is therefore PR A's head after that work (§9a), and every line cited here is read again there (I4).

**0.4 Hypotheses**, each with its discriminator:

| ID | Hypothesis | Discriminator |
|---|---|---|
| H0 | At the base, a second save leaves the strip's save-notice element as the same DOM node, with the same text. | A-A1, CV-K1's new-element half and E-A1, each red at commit T (§4) |
| H1 | `key={condition.id}` on ConditionView's returned root makes a condition with a new id a new element, and keeps the element when the same id's `occurrences` rises. | CV-K1, both halves |
| H2 | No test outside §7's Scope depends on a strip or row element surviving a change of the condition's id. | the whole shell vitest run at the head (I2) |
| H3 | The recorded base changes none of §0.1's lines in shape. | the re-read before code (I4) |

**0.5 Impact read.** Nothing under `engine/`, `kernel/`, `protocol/` or `frontends/shell/src-tauri/` is changed or needed (I6). No owner index changes.

## §1. What this preregistration may and may not claim

**May claim**, each only as far as §4 tests it:
- a save's line in the strip is a new DOM element at each save, and carries the alert role. In Problems, rows are keyed by the condition's id at the base already (`conditions/ProblemsTab.tsx` lines 23 and 27); this piece neither changes nor tests them;
- each save's first line (S3, S4, S23 or S7) ends with the time of day at which the shell had that save's outcome, by the machine's local clock, as `HH:MM:SS` on the 24-hour clock (ADV-2026-11-26-25 item 1); two saves whose times, as the machine's local clock reads them, fall in different seconds of one day therefore show different first lines. The bounds, accepted by item 1: two saves whose outcomes fall in one clock second show the same text, in new elements; a clock set back can show an earlier time; the time is when the shell had the outcome, not when the file was written;
- no S-5 line and no occurrence count for a save.

**May not claim:**
- that a screen reader announces the line. No test here establishes it. AD1 does not ask for it to be observed (ADV-2026-11-26-25 item 3);
- that a save's line shows in the strip when an older condition holds the top (ADV-2026-11-26-25 item 6; §9c);
- any duration, elapsed time or progress figure (ADR-018). The time of day on a save's first line is the machine clock's reading, not a duration;
- that the time shown is when the file was written. It is when the shell had that save's outcome (ADV-2026-11-26-25 item 1);
- any `docs/08` figure;
- anything on macOS or Linux above L1.

**Other commitments:**
- No edit under `protocol/`, `kernel/`, `engine/` or `src-tauri/`, and none to `conditions.ts`, `ProblemsTab.tsx` or `StudioLayout.tsx`. None to `App.tsx` either (ADV-2026-11-26-25 item 2).
- No dependency and no lockfile change.
- ADRs are cited and none is amended: ADR-006 (no operation's class changes; the save's class is the B2-1C form's, unchanged) and ADR-018.
- The B2-1C form is not amended.
- Every shown string is the advisor's: ADV-2026-11-26-25 item 1's four lines (§2.5).

## §2. The change

**2.1 Must 1: new elements** (`conditions/ConditionView.tsx`). Each of the two returned roots, the session-ended `div` (line 58) and the `canvas-refusal` `div` (line 61), carries `key={condition.id}`.
- A condition with a new id is then a new element wherever ConditionView renders it. The strip's alert element is one of those.
- The same id raised again (`occurrences` rising, which shows S-5) keeps its element.
- This reaches every route (ADV-2026-11-26-25 item 4). A refused step's new record notice also becomes a new element.
- The file's doc comment (lines 4-11) gains one sentence saying so, in the worker's words.
- No `App.tsx` line changes for this.

**2.2 Must 2: what differs** (`project/saveProject.ts`), as ADV-2026-11-26-25 item 1 rules: the time, on the first line of every save's batch.
- The machine's local clock is read once per save, when the saver has that save's outcome: at the no-view return (line 101), at the picker's failure (line 108), after `deps.save` resolves (line 113), and in its catch (line 123). It is formatted from `Date`'s local getters as `HH:MM:SS`, two digits each, on the 24-hour clock, with no locale form. The batch's first line (S3, S4, S23 or S7) is item 1's line for it, with that time; no other string of the saver changes. A cancelled picker (line 110) still answers no lines.
- No count of saves is kept: (b) and (c) are not taken (item 1).
- The fixed words stay in the existing exports (`SAVED_NOTICE`, `notSavedNotice`, `NO_VIEW_NOTICE` and `FOLDER_HOLDS_PROJECT_NOTICE`), and the time's form is one exported function that the saver calls, so that tests and the driver read the fixed words by name as `e2e/conditions.mjs` lines 76-82 read `SAVED_NOTICE` today.
- No option or dependency is added for tests. Tests set the clock with vitest's fake `Date` alone (`vi.useFakeTimers({ toFake: ["Date"] })`). In the App tests it is installed before the open and only moved forward, so that the viewport throttle's `Date.now()` (`streaming/viewportStreamManager.ts` line 170) never reads a time before its last query.
- The doc comment at lines 15-16 names ADV-2026-11-26-25 item 1 as the source of the four first lines and states item 1's bounds in the worker's words: two saves whose outcomes fall in one clock second show the same text, in new elements; a clock set back can show an earlier time; the time is when the shell had the outcome, not when the file was written. It claims nothing beyond them (§8 item 7).

**2.3 Not used.** S-5 is not used for a save. A save keeps `occurrences` 1 through `replaceBatch`, and C-A6's no-occurrence assertion (`App.conditions.test.tsx` line 512) stays.

**2.4 The control while a save runs** (OPEN-A2).
- Out (ADV-2026-11-26-25 item 2): a click while a save is in flight still changes nothing, and `App.tsx` is not changed.

**2.5 Strings.** None is drafted here, and none is reproduced: each is the advisor's, carried by reference.
- S3, S4, S23 and S7 are the four first lines of ADV-2026-11-26-25 item 1, byte for byte, with `{time}` and `{message}` filled as that item says. No other string of the saver changes.
- The walkthrough's seven spans are item 3's Old and New texts, byte for byte: four in AD1, one in AE2 and two in AF3a. They are walkthrough words, not shown strings.

No string carries the `[P6 placeholder]` mark (item 11). The merge check compares item 1's four lines and item 3's seven New texts with the diff byte for byte (item 12). Item 3's New texts stand in the walkthrough's diff as they are. Item 1's lines are composed, so for each the check reads the line as the saver builds it at the head: the export's fixed words (`SAVED_NOTICE`, `notSavedNotice`'s words before the message, `NO_VIEW_NOTICE`, `FOLDER_HOLDS_PROJECT_NOTICE`), then the text the diff adds around the message and the time; it compares that with item 1's line byte for byte, with `{message}` and `{time}` standing for the values.

**2.6 Seams** (the seam rule; each consuming side's interface was read at the base).
- **App to ConditionView, through the store's ids.**
  - The props are `{ condition, place, onDismiss }` (`ConditionView.tsx` line 54), and `Condition.id` is the store's (`conditions.ts` line 76).
  - Proven from the real App by A-A1, and in the real app by E-A1.
- **The saver to App.** `ProjectSaver.save` answers `readonly string[] | null` (`saveProject.ts` line 67), and App maps each string to a display (`App.tsx` line 2256). That interface is unchanged. Proven by SP-T1, A-A1 and E-A1.
- **The driver to the source.** `e2e/conditions.mjs` reads the exported words by name. Proven by E-A1 at the head; a missing export makes the run VOID (line 80's pattern).
- There is no `pub` item, prop, option or callback without a product caller. The exported words are used by the saver itself.

**2.7 Portability (R3).**
- The time comes from `Date`, owned by the shell:
  - Windows is supported;
  - macOS and Linux are L1, by unit tests that set the clock and never compare a literal clock string, so the CI's time zone does not matter;
  - the form is fixed, `HH:MM:SS` on the 24-hour clock from `Date`'s local getters, so it reads the same on every OS; no locale form is used (ADV-2026-11-26-25 item 1). The value follows the machine's time zone and clock.
- Nothing else is OS-dependent.
- No path, chord or adapter is new.

## §3. Fixtures, with outcomes declared in advance

- E-A1 runs inside C-E2, on its scratch copy of `100k-happy-path.parquet`, which is hashed before and after (`e2e/conditions.mjs` lines 119 and 161-163). Predicted: unchanged.
- `--fixture` (lines 35-36) names a copy that already stands, so that no kernel test regenerates it.
- Unit tests use no fixture.

## §4. Tests, and one mutation per new test

**Commits and the red rule.**
- Commit T adds the new tests and nothing else. Their red assertions need no export that the base lacks.
- Commit P adds the product change, the template-equality assertions and the changes to existing tests.
- "Red at the base" means red at T, by the assertion named. A red that is an import, type or reference error is not a red (§8 item 10).

**New tests:**
- **CV-K1** (`conditions/ConditionView.test.tsx`): `it("CV-K1: in the strip, a condition with a new id and the same display is a new element; the same id raised again keeps its element", …)`.
  - The new-element half: two `replaceBatch` events on the save-notice route with equal displays, through the real reducer, give two ids.
    - The file's `conditionOn` (lines 85-93) always mints `condition-1` from a fresh state, so this half cannot use it.
    - It renders the first in the strip, holds the element, then renders the second. It asserts that the held element is not connected and that the new one carries the alert role.
    - Red at T.
  - The kept-element half: `conditionOn("stream-terminal", 1)`, then `conditionOn("stream-terminal", 2)`. Both have the same id. It asserts that the element is the same node and that S-5 shows. This half is a guard, green at T and at P. It runs first in the `it`, so that its green at T is observed before the new-element half fails.
- **SP-T1** (`project/saveProject.test.ts`): `it("SP-T1: two confirmed saves of one open answer saved lines that differ, each carrying its own save's fact", …)`.
  - The first assertion is that the two first lines differ. Red at T.
  - At P it also asserts each line against the exported template, at its set clock.
  - Its two clocks are built from local components, `new Date(2026, 10, 26, 23, 4, 5)` and the second after it. At P it also asserts that the time in brackets matches `^\d{2}:\d{2}:\d{2}$` and that its three fields, read as numbers, equal the set clock's `getHours()`, `getMinutes()` and `getSeconds()`. That proves the 24-hour clock, and the two digits of the minutes and the seconds, with no literal clock string (§8 item 9); SP-T2 proves the hours' two digits. It tells local getters from UTC ones only on a machine whose zone is not UTC.
- **A-A1** (`App.conditions.test.tsx`, through the real App and the `e2eSaveProjectToFolder` hook): `it("A-A1: a second save's saved line is a new element in the strip with the alert role, its text differs from the first save's, and no S-5 line stands", …)`.
  - It sets the clock to two different seconds.
  - It holds `.attention-strip .save-notice` before the second save. After the save it asserts:
    - the held element is not connected;
    - the strip's `.save-notice` is another element, with the alert role;
    - its text is not the first save's;
    - no `.condition-occurrences` stands.
  - Red at T at the not-connected assertion, the first it reaches: vitest ends the `it` there, so at T the differs assertion is red in SP-T1 and E-A1, and A-A1's own differs assertion is shown able to fail by M-A3.
- **E-A1** (`e2e/conditions.mjs`, step 1b, between C-E2's steps 1 and 2).
  - The step first waits within the suite's bound until the page's clock reads a whole second later than the step's own first reading of it, which follows step 1's. That wait is a harness bound on readiness, not a timing. Step 1 is not changed at T.
  - It takes a Playwright `ElementHandle` to `.attention-strip .save-notice` (`page.$`; Playwright's page, `e2e/lib.mjs` line 27).
  - It saves again through `e2eSaveProjectToFolder` with step 1's folder. Any answer other than `"not-asked"` makes the run VOID. It then reads every 200 ms, within `WAIT_TIMEOUT_MS` (a harness bound on readiness, not a timing), until the held element is no longer connected. That wait throws no `Void`: if the element is still connected at the bound, the not-connected check records FAIL with the last reading, and the step goes on to its other checks, which read after the wait (as milestone 5's Amendment 12, item 3, does for step 4). No wait of this step ends the run VOID on the change under test, so its red at T is a FAIL, never a VOID.
  - It checks, each by name:
    - the held element is no longer connected, and the strip's top `.save-notice` carries the alert role;
    - its text differs from step 1's line;
    - no `.condition-occurrences` stands.
  - E-A1's text is the same at T and at P (§9a). The time's form is checked at P in step 1, whose checks change at P (lines 131 and 134): its line begins with `SAVED_NOTICE`'s words, read by name, and ends with a time in brackets in item 1's `HH:MM:SS` form, matched by pattern and never by a literal time (§8 item 9). At P, step 3 (line 153) reads the second save's line where it reads the saved line.
  - Red at T at the first two checks, from the real app: save twice, and assert what changed (ADV-2026-11-26-08 item 3).
- **A-S1** is not added (ADV-2026-11-26-25 item 2).
- **SP-T2** (`saveProject.test.ts`; ADV-2026-11-26-25 item 1's (ii)): two refused saves with the same kernel message, at two set seconds, answer first lines that differ. That assertion is red at T. Its two clocks are built from local components, `new Date(2026, 10, 26, 9, 4, 5)` and the second after it, and at P its check of the time's form is SP-T1's pattern and field assertion, which proves the hours' two digits. At P it also asserts each line against `notSavedNotice` and the time's form at its set clock, and adds one case: a picker that throws (line 108) answers a first line that carries the time at its set clock, asserted against `notSavedNotice` with the picker's message and the time's form.

**Mutations.** Each is applied alone, the named test is run, the failure is recorded by name with the commit beside the test (a RECORDED MUTATION and an OBSERVED AT line), and the mutation is reverted. `scripts/plan/verify-mutation.mjs` at `a5d8b8b` checks only that a mutation is recorded; it observes nothing (the template's Round 25 additions, mutation-observation wording). A mutation that does not fail where it is predicted goes to the advisor, and nothing is changed to make it fail.
- **M-A1:** the key removed from the `canvas-refusal` root. Fails CV-K1 (new element) and A-A1 (not connected). It is unit-only for E-A1 (ADV-2026-11-26-25 item 7): E-A1's red at T is the proof that its check can fail.
- **M-A2:** the key becomes `` `${condition.id}:${condition.occurrences}` ``. Fails CV-K1 at the kept-element half.
- **M-A3:** the clock is read once when the saver is created. Fails SP-T1 and A-A1 at their differs assertions. Unit-only for E-A1, whose red at T already shows that check failing.
- **M-A4:** not used (A-S1 is not added).
- **M-A5:** the not-saved line with the kernel's message (S4) carries no time. Fails SP-T2 at its differs assertion.
- **M-A6:** the time's hours are taken modulo 12. Fails SP-T1 at its field assertion at P.
- **M-A7:** the picker's failure line (line 108) carries no time. Fails SP-T2 at its picker case at P.

**Existing tests changed** at P, each to the ruled line at its set clock. No assertion is removed or loosened.
- `saveProject.test.ts` lines 64, 65, 94, 95, 111, 114, 121 and 150. Lines 132 (S4) and 138 (S7) too, and `App.save.test.tsx` line 213 (S23).
- `App.save.test.tsx` line 199.
- C-A6, `App.conditions.test.tsx` lines 499, 501 and 511. Its two saves keep one set clock, so its equality still holds.
- `e2e/conditions.mjs` lines 76-82, 131, 134 and 153, and its header (line 5 and lines 11-18, as PR A leaves them).

**Kept green with no edit:**
- C-R1 in `ConditionView.test.tsx` (a key renders no attribute);
- `conditions.test.ts`, `ProblemsTab.test.tsx` and `StudioLayout.test.tsx`;
- C-A7 and the rest of `App.conditions.test.tsx`, and `App.lateResult.test.tsx`.

By reading, and not run by this piece: `e2e/conditions-baseline.mjs`, `project.mjs`, `colour.mjs`, `reopen.mjs` and `second-open.mjs`.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predicted:**
- CV-K1's new-element half, SP-T1, SP-T2, A-A1 and E-A1 are red at T and green at P.
- CV-K1's kept half is green at both.
- E-A1's run at commit T, the red commit, ends red at E-A1's not-connected and differs checks, and every other C-E2 check passes (ADV-2026-11-26-25 item 9).
- At T, every C-E2 check outside E-A1 passes.

**Declared unchanged:**
- the store, its routes, its ids and its order;
- the strip's layout and the Problems rows;
- the picker, and `folder: null` on a later save;
- the kernel's reply, and every protocol byte;
- S-5, and C-A6's line 512;
- the in-flight drop (ADV-2026-11-26-25 item 2), and `App.tsx`;
- the cancelled picker, which still ends the old lines and shows none (`saveProject.ts` line 110, then `replaceBatch` with no displays);
- C-R1's markup.

**Invalidators (stop, and report to the custodian):**
- **I1:** at the recorded base, a save's lines are not minted anew per save, or ConditionView is not the strip's renderer.
- **I2:** a test outside Scope fails with the key. That is a stop to the advisor; a file joins only by class 9 on a ruling.
- **I3:** before code, the worker searches the recorded base for `SAVED_NOTICE` and its words (and also for `NO_VIEW_NOTICE`, `notSavedNotice`, `FOLDER_HOLDS_PROJECT_NOTICE` and their words), and finds a reader outside §0.2 and §4's list.
- **I4:** the recorded base differs from 7dbf2f3e in the shape of ConditionView's roots, the saver's lines 93-128, the save site (`App.tsx` lines 2237-2259) or C-E2's steps 1 to 3. The worker re-reads them before code.
- **I5:** at T, a C-E2 check outside E-A1 fails. E-A1's red is then not attributable to it alone.
- **I6:** anything needs a change under `protocol/`, `kernel/`, `engine/` or `src-tauri/`, for example a time or a mark from the kernel. That is a stop to the advisor.
- **I7:** item 1's four lines cannot be built so that the driver reads their fixed words by name.
- **I8:** E-A1's wait for the next second runs out at its bound.

**Falsification:** the form is wrong if, at T, a second save already makes the strip's save-notice a new element, or already shows different text.

**Stops on the code and the runs:**
- no code before PR A's reviewer has passed its second attempt (ADV-2026-11-26-08 item 3);
- no app start of this piece before the port is free and the tester's start is filed; A's code and its vitest runs go ahead inside holds, in A's turn (ADV-2026-11-26-25 item 9; §9a);
- if E-A1's run at T ends green, or red for another reason, the piece stops and goes to the advisor, and the code written by then is not taken further until the advisor rules (ADV-2026-11-26-24 item 2, applied by ADV-2026-11-26-25 item 9);
- under the floor again, every run holds (ADV-2026-11-26-19 item 7).

## §6. Instruments

Assertions only: DOM node identity (`isConnected`, `!==`), the alert role, text inequality, and text equality to the template at a set clock, a pattern match on the time's form in C-E2's step 1 at P, and in SP-T1 and SP-T2 the same pattern with the time's fields compared to the set clock's local getters. There is no measurement and no `docs/08` row.

**What the runs cost on C:**, from the code, not measured:
- Each C-E2 run starts `npx tauri dev` (`e2e/lib.mjs` line 193), which serves the page from localhost:5180 (line 37) and builds and starts the app.
- It copies the fixture into a scratch `LOCALAPPDATA` under the OS temp folder and keeps that folder at the end (`e2e/conditions.mjs` lines 27-29, 171-172 and 189). It also makes a project folder that it never removes (lines 126-127).
- The declared runs are T and P; there is no M-A1 run (ADV-2026-11-26-25 item 7).
- A launch's writes in the app's log folder are its ordinary writing. No run changes or deletes a file that stands there, and the room taken counts under the floor (ADV-2026-11-26-17 item 4).

## §7. Declared values and ceilings

No new constant or ceiling in the product. E-A1's wait for the next second uses the suite's own `WAIT_TIMEOUT_MS` (line 39).

**Size**, for the ruled combination, OPEN-A1 (a) with (ii), OPEN-A2 (a) and OPEN-A4 (i) (ADV-2026-11-26-25 items 1, 2, 4 and 10): at most 280 changed lines (insertions plus deletions) over at most 7 files, restated under item 10 (see below).

| File | Estimate (lines) |
|---|---|
| `frontends/shell/src/conditions/ConditionView.tsx` | about 6 |
| `frontends/shell/src/conditions/ConditionView.test.tsx` | about 35 |
| `frontends/shell/src/project/saveProject.ts` | about 28 |
| `frontends/shell/src/project/saveProject.test.ts` | about 77 |
| `frontends/shell/src/App.conditions.test.tsx` | about 48 |
| `frontends/shell/src/App.save.test.tsx` | about 8 |
| `frontends/shell/e2e/conditions.mjs` | about 53 |
| **Total** | **about 255** |

**The other branches** (OPEN-A1 (b), (c) and (i), OPEN-A2 (b) and OPEN-A4 (ii)) are not taken (ADV-2026-11-26-25 items 1, 2 and 4), and their figures are withdrawn before the form is committed. The table above is the ruled combination's: with (ii) and the two assertions the reviewer's form gate added to `saveProject.test.ts` (M-A6, M-A7) it comes to about 255 lines over 7 files, over the 250, so the ceiling is restated before the form is committed. Item 10 names the author's count with (ii); this form reads it as the estimates the form now carries, the gate's two additions included, and the custodian tells the advisor of the restated 280 before the commit.

**Records, outside the count:**
- `frontends/shell/e2e/README.md`: the C-E2 sentence (line 929, as PR A leaves it);
- `frontends/shell/MANUAL-WALKTHROUGH.md`: item 3's seven spans, four in AD1 (line 2030), one in AE2 (line 2060) and two in AF3a (line 2086). The Result log lines are not edited;
- no `KNOWN-LIMITATIONS.md` item (ADV-2026-11-26-25 item 5);
- this form, and `governance/PLAN.yaml`.

**Counting:** `git diff --numstat <base>...<head> --` over the seven paths, read at a named commit. `<base>` is §9a's recorded base commit. Once any head is merged in after the base (ADV-2026-11-26-25 item 8), the count is instead the sum of `git log --first-parent --no-merges --numstat <base>..<head> --` over the same paths, so that no merged-in head's lines count as A's.

An overrun is class 8 (`budget overrun, §7 not edited`), and this section is never edited to match. A file added is class 9, declared before its code.

## §8. Block-on-sight

1. A diff outside §7's files, its records, this form and PLAN.
2. Any edit under `protocol/`, `kernel/`, `engine/` or `src-tauri/`, or to `conditions.ts`, `ProblemsTab.tsx` or `StudioLayout.tsx`.
3. S-5 or `raisedTimesText` used for a save, or C-A6's line 512 removed or loosened.
4. Any change to `App.tsx` (ADV-2026-11-26-25 item 2).
5. A first line, or a walkthrough span, that differs by a byte from ADV-2026-11-26-25 item 1's four lines or item 3's seven New texts; another saver string changed; or a `[P6 placeholder]` mark on any of them (items 1, 3 and 11).
6. A duration, elapsed time or progress figure on any line.
7. A claim, in code, comments or records, that a screen reader announces the line, or that the time shown is when the file was written.
8. An assertion removed or loosened beyond §4's list.
9. A literal clock string asserted in a test.
10. A red at T that is an import, type or reference error.
11. A merge into main before the sitting's checkout stands with its filed start, or while the human's app runs from the main checkout; or any merge into `release/v0.2`.
12. An app start of this piece before the port is free and the tester's start is filed; code before PR A's reviewer has passed its second attempt; or a change to E-A1's text after commit T not recorded by its class (§9a).

## §9. Gates

- **Form gates:** a fresh architect and the reviewer.
- **Architect, build:** ADR-018's vocabulary; the seam rule (A-A1 and E-A1 from the real shape); the claims of §1; and §8 item by item.
- **Reviewer, build:** the full diff, item 1's four lines and item 3's seven New texts against the diff byte for byte (ADV-2026-11-26-25 item 12), and the observed mutations.
- **Suites:**
  - the shell's typecheck and vitest run, after `npm ci` in both `frontends/shell` and `renderer/bundle-viewer`;
  - `node e2e/conditions.mjs` at T, the red commit (red at E-A1 only), and at P (green), once the port is free (ADV-2026-11-26-25 items 7 and 9);
  - `verify-cites`, `verify-quotes`, `verify-plan` and the `node --test` scripts suite.
- **Which runs start the app:**
  - every `node e2e/conditions.mjs` run starts it, through `npx tauri dev` and the dev server on localhost:5180;
  - none of the others does: `npm ci`, the typecheck, vitest with the mutation runs under it, the `scripts/plan` verifiers, the `node --test` suite and `git diff --numstat`.
- **Operator:** AD1 as ADV-2026-11-26-25 item 3 changes it, with a blank result-log line, queued into a later sitting. Felt verdicts are the human's.

## §9a. Base, runs, merge and overlap

**Base.**
- PR A's head at the commit where PR A's reviewer has passed its second attempt, once PR A has taken PR 365's head in (ADV-2026-11-26-08 item 3; ADV-2026-11-24-19). Before code, the worker checks with `git merge-base --is-ancestor` that PR 365's head is an ancestor of that commit. If it is not, A's code does not start and A makes no merge of PR 365 of its own: that is a stop to the custodian. The read checkout's 7dbf2f3e is never the base.
- It holds PR A's remaining work, Amendment 12 included (§0.3).
- PR 366's head does not join: the piece does not change `App.tsx` (ADV-2026-11-26-25 item 2).
- The base commit and the merge commits' ids are recorded in this form's first amendment, before code.
- A head of PR A or PR 365 that moves before A's runs is merged in by a merge commit, with a narrow read, and recorded by amendment (ADV-2026-11-26-25 item 8).

**Runs** (ADV-2026-11-26-25 item 9, under ADV-2026-11-26-24 items 2 and 5, with ADV-2026-11-26-19):
- Commit T is the red commit: the first commit with code after the base, holding the new tests and nothing of the fix (§4). Product code starts in commit P. Only record commits (this form, its amendments and PLAN) may stand between the base and T; that is this form's reading of the first commit after the base in ADV-2026-11-26-24 item 2.
- Once PR A's reviewer has passed its second attempt, A's code and its vitest runs go ahead inside holds, in A's turn in the ruled build order (ADV-2026-11-26-08 item 4), though the port is still held.
- No app start of this piece comes before the human has closed their app, the port is seen free by reading, and the tester's one start in the sitting's checkout is filed (ADV-2026-11-26-19 items 2 and 5). E-A1's run at commit T is made then, as soon as the port is free.
- That run must end red for E-A1's own reason: its not-connected and differs checks fail, and every other C-E2 check passes. If it ends green, or red for another reason, the piece stops and goes to the advisor, and the code written by then is not taken further until the advisor rules.
- E-A1's text does not change after commit T. If it must, the change is recorded by its class, and the T run is made on the changed text.
- The P run follows. The pull request does not leave draft before the T run and the P run are filed, and A is not complete before then (ADV-2026-11-26-24 item 2; ADV-2026-11-26-19 item 3).

**Overlap**, by file, against every open PR (by the custodian's git, each three-dot against its merge base with main) and the pieces in progress (by their forms at c28c8cf1). KNOWN-LIMITATIONS items and walkthrough Parts count as separate paths.

| Path | Shared with |
|---|---|
| `src/conditions/ConditionView.tsx`, `ConditionView.test.tsx`, `src/App.conditions.test.tsx` | PR A only (in the base). |
| `src/project/saveProject.ts` | No open PR. In progress: text-id, under its OPEN-H2 C4 only (the shown refusal, its form's OPEN list). |
| `src/project/saveProject.test.ts` | No open PR. In progress: the identity route and text-id, at the SKP literal (line 70). A's lines are 64-65, 94-95, 111-121, 150 and a new `it`; line 65 and line 70 are five lines apart, with four unchanged lines between. |
| `src/App.save.test.tsx` | None. |
| `e2e/conditions.mjs` | PR A (in the base). Amendment 12 rewrites header lines 5, 17 and 18 and step 4, and A's header edit meets those lines. That is why A is built only on PR A's final head. |
| `e2e/README.md` | PR A (the C-E2 sentence itself; Amendment 12 (f)), PRs 359, 363, 365 and 366, the identity route, text-id, and B's piece (the `project.mjs` entry). These are separate entries, apart from PR A's. |
| `MANUAL-WALKTHROUGH.md` | PR 363 (Part AE, AE2; in the base), PR A (Part AF, AF3a; in the base), PRs 365 and 366, the identity route and text-id (new Parts), and the v0.2 result-log pull request (Part AD's Result log, on `release/v0.2`; ADV-2026-11-26-15 item 8). A does not edit the Result log, so no line is shared with that pull request. |
| `KNOWN-LIMITATIONS.md` | Not touched: no item (ADV-2026-11-26-25 item 5). By its round-3 text, B's piece touches neither this file nor the walkthrough. |
| `src/App.tsx` | Not touched (ADV-2026-11-26-25 item 2). |
| None | PRs 350, 353, 356, 360, 361, 362 and 364, on §7's paths. |
| Not read | The case-fold build's and the stall measurement's files. The custodian checks §7's paths against them by git before code. |

- **Rule (00):** no `protocol/` path is touched, so A does not wait for the `protocol/` place.
- **Order:** among the builds, A comes after B (ADV-2026-11-26-08 item 4).

## §9b. OPEN items, ruled by ADV-2026-11-26-25 items 1 to 8 (each entry keeps the draft put to the advisor; its ruling line binds, and an option not taken binds nothing)

**OPEN-A1: what differs from the last save's line.** **Ruled (ADV-2026-11-26-25 item 1):** (a) with (ii), the time as `HH:MM:SS` on the 24-hour clock, no locale form; (b), (c) and (i) are not taken. Every candidate keeps §2.1's new elements.
- **(a) The time of the save by the machine's clock, to the second, on the saved line.** This is the advisor's leaning.
  - **Cost:**
    - product about 16 lines;
    - SP-T1 and A-A1 under a fake `Date`, and the eight `saveProject.test.ts` sites, `App.save.test.tsx` line 199 and C-A6's three assertions moved to a set clock;
    - E-A1 waits up to about one second within its bound;
    - a Portability item (§2.7).
  - **Bound:**
    - Two confirmed saves inside one clock second show the same text, though in new elements. Ordinary use reaches this: a quick double-click whose first save ends before the second click. The second click is not in flight, so the saver takes it (`saveProject.ts` lines 98-99).
    - A clock set back can show the same or an earlier time.
    - The time is read after the confirmation, so it is after the kernel has answered: later than the write by the reply's return and the page's handling of it, for which the code sets no bound.
  - **Sub-questions,** answered: `HH:MM:SS` on the 24-hour clock, no locale form (item 1); the bounds are recorded in §1 and the saver's doc comment (items 1 and 5).
- **(b) A count of this open's confirmed saves.** Not taken (item 1).
  - **Cost:** product about 18 lines; in the tests, SP-T1 and A-A1 by count, and the eight `saveProject.test.ts` sites, `App.save.test.tsx` line 199 and C-A6's three assertions moved to their counts (line 511 at count 2); no fake clock, no wait in E-A1, and no Portability item.
  - **Bound:** never the same twice within one open. It starts again at each open, after the last save's line has ended (`next-open`).
- **(c) Both (a) and (b).** Not taken (item 1). About 20 lines more than (a), in the product and the tests: (a)'s test costs and (b)'s, and M-A3 as two mutations. It closes (a)'s same-second case.
- **Which lines carry it, for any candidate:**
  - (i) the saved line only. Not taken (item 1). A second refused save with the same message, for example a folder that cannot be written, which ordinary use reaches, then shows the same text in a new element;
  - (ii), taken with (a) (item 1): the first line of every save's batch: saved, not saved (S4, S23) and folder holds a project (S7). That is about 25 lines more (SP-T2, M-A5), and AD1's not-saved line changes too. A count of confirmed saves does not change at a refusal, so (ii) is open only with (a) or (c), or with (b) restated as a count of this open's answered saves; with (b) as drafted, SP-T2 cannot pass.
- **Not candidates:**
  - (a) to the minute, because two saves in one minute are ordinary use;
  - a mark from the kernel's reply, which is a wire change (I6);
  - S-5, which ADV-2026-11-26-08 item 3 excludes;
  - an entry animation alone, which leaves nothing true on screen once it ends.
- **My reading:** (b) costs least and has no gap within an open; (a) has the double-click gap; (c) closes it at the highest cost. The words and the choice are the advisor's.

**OPEN-A2: the control while a save runs.** **Ruled (ADV-2026-11-26-25 item 2):** (a), out; (b) is not taken, and PR 366 does not join.
- (a) Out, as drafted. A click during a save still changes nothing.
- (b) In.
  - **Cost:** `App.tsx` about 14 lines and A-S1 about 30 lines. PR 366 joins by a merge commit, with a narrow read. There is a new string (the advisor's).
  - **Proof:** unit-only, from the real App. The real app cannot hold a save in flight without a new hook, and a hook with no product caller is not added.

**OPEN-A3: AD1's words** (ADV-2026-11-26-08 item 3: the advisor's, at the form's gates). **Ruled (ADV-2026-11-26-25 item 3):** seven spans, four in AD1, one in AE2 and two in AF3a, each Old and New text as item 3 gives it; AD1 does not ask for Narrator; no Result log line is edited.
- Under any candidate, AD1's expected outcome (line 2030) is untrue where it gives the saved line's words and where it says the second click shows the saved line again.
- AE2 (line 2060) and AF3a (line 2086) quote the saved line too. Whether they change depends on OPEN-A1's words.
- Also the advisor's: whether AD1 asks the human to listen with Narrator, which is built into Windows and needs no dependency.
- **Cost:** none in code; three rows, seven spans (item 3).

**OPEN-A4: the key's reach.** **Ruled (ADV-2026-11-26-25 item 4):** (i); (ii) is not taken.
- (i) Every route through ConditionView, as drafted. A refused step's new record notice also becomes a new element.
- (ii) The save-notice route only, with a conditional key. About 2 lines more, and a second rule inside one renderer. Under (ii), CV-K1's kept-element half raises the save-notice route twice through the real reducer's `raise` with one key, in place of `conditionOn("stream-terminal", …)`: a stream-terminal element carries no key under (ii), so M-A2 could not fail that half.

**OPEN-A5: the record of the bound** (**ruled, ADV-2026-11-26-25 item 5:** neither; no KNOWN-LIMITATIONS item and no words in AD1 beyond item 3's; item 1's bounds are recorded in §1 and the saver's doc comment) under OPEN-A1 (a) or (c), and of OPEN-A6 (a)'s gap under any OPEN-A1 candidate: a KNOWN-LIMITATIONS item (adds that file to the records), words in AD1, or neither. Neither holds only while no record, comment or shown string says that a save's line always differs or is always announced.

**OPEN-A6: a save under an older condition** (§0.1, Order). **Ruled (ADV-2026-11-26-25 item 6):** (a), out; recorded as a finding for milestone 5's second part (§9c).
- (a) Out. The save's rows are new elements in Problems, but none carries the alert role. It is recorded in §9c.
- (b) In. Not taken (item 6). That changes the ruled order for notices and `conditions.ts`, which this form keeps out.
- **My reading:** (a).

**OPEN-A7: M-A1's observation on E-A1.** **Ruled (ADV-2026-11-26-25 item 7):** (b).
- (a) One more C-E2 run at P with M-A1 applied. It costs one launch and its scratch on the temp folder's drive.
- (b) Unit-only for E-A1. Its red at T stands as the proof that the check can fail.

**OPEN-A8: a head that moves before A's runs.** **Ruled as proposed (ADV-2026-11-26-25 item 8),** for PR A and PR 365; PR 366 does not join (item 2). Proposed, by analogy with ADV-2026-11-26-14 item 1 for B: a new head of PR A or PR 365 (or of PR 366 under OPEN-A2 (b)) is merged in by a merge commit, with a narrow read, and recorded by amendment. **Cost:** one narrow read per moved head.

## §9c. A finding for milestone 5's second part (ADV-2026-11-26-25 item 6; paraphrase)

Ordinary use reaches a state this piece leaves: while an older notice holds the strip's top, a save's line shows only in Problems, with no alert role (§0.1, Order). When milestone 5's second part's form comes, two questions go with it to the advisor: whether a newer notice of the same urgency should take the strip's top, and whether that part's KNOWN-LIMITATIONS words cover a save's line under an older notice. This piece changes neither the order nor `conditions.ts`.

## §10. Amendments (opens empty, append-only)

## Amendment 1 — 2026-11-26 — at the first commit: the authority on main, the node's gate, the form gates, the round that carries ADV-2026-11-26-25, the milestone 5 finding; no span hashes

*Written by the custodian at the form's first commit, after both form gates and before any code. References and hashes only. Nothing above is edited: the "Path proposed" line and "the custodian adds the node" are the form's as gated.*

1. **Authority on main.** The rulings the Authority list names are filed under `state/directives/`:
   - ADV-2026-11-26-08 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-08-findings-a-b-c-placed-b-first-with-its-adr-drafted-now-a-after-it-on-milestone-5-pr-a-c-not-a-piece.md`;
   - ADV-2026-11-26-15 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-15-the-order-of-the-reads-what-assumes-main-first-no-held-piece-merges-until-the-sittings-checkout-stands-the-lab-facts-to-the-lasting-identity-consult.md`;
   - ADV-2026-11-26-17 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-17-bs-form-is-the-architects-lead-datas-drafts-are-inputs-s0-b-met-by-a-read-of-the-pinned-sources-a-launchs-writes-do-not-count-against-11.md`;
   - ADV-2026-11-26-19 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-19-c-over-the-floor-noted-the-humans-running-app-stays-untouched-nothing-starts-the-app-or-a-dev-server-until-they-close-it.md`;
   - ADV-2026-11-26-24 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-24-b-form-open-6-b-code-and-unit-tests-start-inside-holds-the-red-commit-first-five-conditions.md`;
   - ADV-2026-11-26-25 at `state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-25-a-form-open-a1-to-a8-the-time-of-the-save-on-every-first-line-seven-walkthrough-spans.md`.
   - The inputs are filed as drafts: lead-data's at `state/drafts/a-second-save-is-announced-form-input-lead-data.draft.md`, and the architect's draft at `state/drafts/a-second-save-is-announced-form-architect.draft.md`.
2. **The node's gate.** The PLAN node `a-second-save-is-announced` names this form as its gate. It was added as proposed at 97fe4f313c1157ffad147a7fcd48d1f8fd2bdd19. Its class is full, with both gates, as the form's title says.
3. **The form gates and the round that carries ADV-2026-11-26-25.** Each round's pairs were applied by the custodian by script, with each Old text found exactly once.
   - The architect read the draft (sha256 27ef3e05) at the read checkouts 7dbf2f3e and c28c8cf1. It gave BLOCK, gate-log row 913, in `state/consults/gates/2026-11-26-a-second-save-is-announced-form-gate-architect.md`. Its 24 pairs gave round 2 (38e472a3).
   - The architect's narrow read gave PASS WITH NOTES, row 914, in `state/consults/gates/2026-11-26-a-second-save-is-announced-form-gate-architect-narrow-read.md`. Its one pair gave round 3 (3f3eeb8b).
   - The same architect, resumed, wrote the pairs that carry ADV-2026-11-26-25 into round 3: 74 numbered, 87 Old/New. They are filed at `state/consults/2026-11-26-a-second-save-is-announced-form-round-4-the-architects-pairs-carrying-adv-2026-11-26-25.md`, and they gave round 4 (122eae6f). Those pairs are not a gate: the reviewer read round 4 fresh.
   - The reviewer read round 4. It gave BLOCK, row 918, in `state/consults/gates/2026-11-26-a-second-save-is-announced-form-gate-reviewer.md`. Its 17 pairs gave round 5 (0a0e88f5). The report's own figure, 8f863be8, lost three backslashes in its shell.
   - The reviewer's narrow read found N1 on round 5 and set its condition: PASS WITH NOTES once N1 to N3 are applied, with no further read. Row 919, in `state/consults/gates/2026-11-26-a-second-save-is-announced-form-gate-reviewer-narrow-read.md`, records PASS WITH NOTES on round 6. Its 4 pairs gave round 6, and round 6's hash is the read's own figure.
   - The result is this file's first 47807 bytes, sha256 4e313bc4c9b42cb01105308b5bfaae9f795766fcc89649c085cc76d95431febb.
4. **The ceiling** is restated to 280 changed lines over 7 files before this commit, under ADV-2026-11-26-25 item 10 (§7).
5. **The finding for milestone 5's second part** (ADV-2026-11-26-25 item 6; §9c) is in the summary of the PLAN node `shell-migration-milestone-5`, from 97fe4f313c1157ffad147a7fcd48d1f8fd2bdd19.
6. **No span hashes.** The form writes its code lines in words and cites its forms and documents by section (its Authority and Drafted by lines). It has no `path:line` cite to hash: verify-cites's recognizer, run by script over the whole text, found none, and neither did a scan for bare `:n`.

## Amendment 2 — 2026-11-27 — the custodian's: the base under ADV-2026-11-27-08 item 4, before any code

*References and hashes only. Nothing above is edited.*

1. **The ruling.** ADV-2026-11-27-08 (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-08-readings-on-363-and-366-right-the-build-gates-of-the-identity-route-and-b-in-two-parts-a-starts-on-pr-as-head-the-order-for-the-places.md`), item 4, replaces the sentence of ADV-2026-11-26-08 item 3 that made A's code wait for PR A's reviewer's second attempt. A is built on PR A's present head with PR 365's present head in, under the five conditions of ADV-2026-11-26-24, commit T first (ADV-2026-11-26-25). A head of either that moves comes in by a merge commit, with the reviewer's narrow read (ADV-2026-11-27-08 item 2).
2. **What changes, with no line edited.** The Base line at the form's head, §9a's Base and Runs, the stops on the code and the runs, and §8 item 12 no longer wait for PR A's reviewer's second attempt: "Once PR A's reviewer has passed its second attempt" and "no code before PR A's reviewer has passed its second attempt" no longer hold A's code.
3. **The base.**
   - By `git merge-base --is-ancestor`, PR A's head d6c2daf69eb500027197945f5a4302f0508e0f69 does not hold PR 365's head 639a96cc25873c99d606b4d75541bd8f3de37543.
   - The custodian merged 639a96cc25873c99d606b4d75541bd8f3de37543 into d6c2daf69eb500027197945f5a4302f0508e0f69 on the branch `cut/a-second-save-is-announced`, at f64fac32f3c75da5b4ea57e5b38eee89b92ec22a, with no conflict. That commit is the base.
   - By git, the patch-id of `git diff d6c2daf6 f64fac32` equals that of `git diff 2095a7ac 639a96cc`: PR 365's commits since the head PR A held, 8 files, 36 insertions and 22 deletions.
   - By git, the patch-id of `git diff 7dbf2f3e f64fac32` equals that of `git diff 806ad308 d6c2daf6`: from the read checkout's merge, which the form gates read, the base differs by PR A's own move only. 7dbf2f3e is still never the base.
4. **The custodian's reading, sent to the advisor.**
   - §9a's "A makes no merge of PR 365 of its own" is read as the worker's rule. The custodian's merge before any code, recorded here, is how PR 365's present head is in.
   - The worker's `--is-ancestor` check reads 639a96cc25873c99d606b4d75541bd8f3de37543 against f64fac32f3c75da5b4ea57e5b38eee89b92ec22a.
   - The reviewer's narrow read of this merge (ADV-2026-11-23-15 item 4) comes before A's build gates, in a reviewer's place.
5. **The order.** A's code comes in the places' order (ADV-2026-11-27-08 item 5): after B's read parts, or earlier in a place that the cap on the strongest model keeps free, if its worker's class allows it. Only record commits stand between the base and commit T (§9a).
6. **What stands.** No app start before the port is free and the tester's start is filed; E-A1's run at T as soon as it is; and the stop if that run ends green, or red for another reason (§9a's Runs; ADV-2026-11-26-24 item 2).
