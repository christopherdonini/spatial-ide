*Custodian's filing note (2026-11-14): the architect's draft of Amendment 16 to PR B's form (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`), written after the colour-by phase's part 1 stopped at its fill probe (`state/consults/2026-11-14-b1-shell-half-pr-b-colour-by-part-1-fill-probe-stop-worker-report.md`), read only at main 0e31e371 with PR B's branch at 5b309b78, from its brief by file (5092 bytes, sha256 04b94732adf7428f7a3265d443b37a2ddd801c73b7a689d3a4c12e48cb9849db, written at 2026-11-14T11:11:50Z). Dispatched at 2026-11-14T11:12:06Z by its transcript; handed back at 2026-11-14T11:21:32Z (claude-opus-5-5, architect; calls Read 35, Grep 23 and the hand-back, 59 in all; none errored; no write). The draft below was extracted by script from the hand-back in that transcript (17019 bytes, sha256 eccce3369c00fe4b68f01a9b077f4b255bd5cf98577a6e1e1878aad51424846d). Nothing is changed. Its `sha256:<H>` and `<R>` placeholders are left as drafted; the form's Amendment 16 fills them by script, with the custodian's changes its carrying note lists, and its item 7 records the OPEN items.*

---

**Verdict:** pass with notes, on the form as it stands, for this drafting consult. I reviewed `cut/b1-shell-half-pr-b @ 5b309b78e14bb40109656cb4e0d7ee62abf79156`, and the form and the code at main 0e31e371, the main checkout's HEAD. For every file pinned below, that tree is the same as 08ce9935.
- **Correctness:** none of it blocks today. OPEN-4 below is a Correctness risk that must be settled before the code of the re-issue.
- **Evidence:** the I1 stop holds. Each off-list site the worker reported is at the line the report gives, in the code at 5b309b78.
- **Documentation:** the findings are listed after the OPEN items. Each is must-fix before the merge.

```
## Amendment 16: scope addition (class 9), written after the worker's I1 stop at the colour-by phase's fill probe was seen, and before any colour-by code. `frontends/shell/src/canvas/decodeBatch.ts` and `frontends/shell/src/canvas/WorkingCanvas.test.ts` join PR B's list. `fillMatch` is required (class 1). The not-held shape keeps the existing literal and adds one required member to the attribute block (class 1). PB-U10 is split, and PB-U11 is added (class 9). The order is: this amendment, the probe again, then code (class 1).

*Drafted read only by the architect, with main read at 0e31e371 and PR B's branch read at 5b309b78e14bb40109656cb4e0d7ee62abf79156 (`state/consults/2026-11-14-b1-shell-half-pr-b-amendment-16-colour-by-fill-probe-class-9-architect-draft.md`). The custodian's script fills each `sha256:<H>` with the sha256 of the cited whole lines, each with its LF, at 08ce9935. Every file pinned here is unchanged by PR B's branch. A line in a file the branch changed is named in words, with its line at 5b309b78, and is never hashed (round 25, item 2). `<R>` is the filed path of the worker's stop report, filled by the custodian. That report is evidence, not Authority. The addition rests on the cross-module seam rule (round 4) and on §2.6's last paragraph (round 25, item 2 (a)). References only: nothing below is a quotation. §7 is not edited.*

1. **`fillMatch` is required (class 1, the architect's reading of §2.3 (a)).**
   - The choice: `StyleState.fillMatch` is required, typed `… | null`. "Defaulting to `null`" is read as `DEFAULT_STYLE_STATE`'s value (`frontends/shell/src/style/document.ts:75-80 @ 08ce9935 sha256:<H>`), not as an optional member. This follows Amendment 3 item 5 and Amendment 4 item 2.
   - Why:
     - Every product site except the default carries the member by spread.
     - A future writer of a whole `StyleState` must then set it. That includes 1c step 2's recovery, which is written against `StyleState` at its own base (Amendment 12 item 6).
     - An optional member would compile with the member dropped, and the category style would then be lost silently.
     - Two states (`undefined` and `null`) for one fact would also be a code path with no product caller (§8 item 13).
   - The sites this choice alone adds, from the probe's list in `<R>`:
     - off the list: `frontends/shell/src/canvas/WorkingCanvas.test.ts:151 @ 08ce9935 sha256:<H>`, one `fillMatch: null` fill;
     - on the list: `document.test.ts` (TS2741, at 128) and `viewTransitions.test.ts` (at 29).
   - Optional would remove those three sites and add none.

2. **The not-held shape (class 1, the architect's reading of §2.2 (d) and OPEN-20 (a)).**
   - **The shape.** `ResidentBatch.attributes` keeps its type (`frontends/shell/src/canvas/decodeBatch.ts:178-181 @ 08ce9935 sha256:<H>`).
     - `BatchAttributes` (`frontends/shell/src/canvas/decodeBatch.ts:99-104 @ 08ce9935 sha256:<H>`) gains the required `kept: "projection" | "match"`.
     - `copyAttributes` writes `"projection"` (`frontends/shell/src/canvas/decodeBatch.ts:130 @ 08ce9935 sha256:<H>`). This is a type fill: no behaviour changes.
     - A batch past the ceiling while a match column is current keeps a block with `kept: "match"`. Its `names` is that one column, its `data` is a copy of that column alone, made in `values.ts`, and its `bytes` is that copy's length.
     - With no current match column, the batch is `"not-held"`, as it is today.
   - **What each reader needs:**
     - **The duplicate drop** (`frontends/shell/src/canvas/tileResidentSet.ts:235-242 @ 08ce9935 sha256:<H>`, `frontends/shell/src/canvas/tileResidentSet.ts:262 @ 08ce9935 sha256:<H>`): no edit. The rebuild maps every object block, so a match block gets its row map in the same loop, and the spread carries `kept`. The guard holds, because the ceiling runs on the decoded batch before ingest (the next bullet), so `rows` is null on arrival.
     - **The ceiling path** (`frontends/shell/src/canvas/WorkingCanvas.tsx:1072-1077 @ 08ce9935 sha256:<H>`, `frontends/shell/src/canvas/WorkingCanvas.tsx:1471 @ 08ce9935 sha256:<H>`, `frontends/shell/src/canvas/WorkingCanvas.tsx:1707 @ 08ce9935 sha256:<H>`): a real edit inside WorkingCanvas 70. `withinAttributes` passes the current `style.fillMatch` column.
     - **`limits.ts`** (`frontends/shell/src/canvas/limits.ts:81-91 @ 08ce9935 sha256:<H>`): a real edit inside limits 25.
       - `withinAttributeCeiling` gains a required third parameter, the match column or null, with no default (§8 item 13).
       - Past the ceiling it returns the match block, or `"not-held"`. A block already `"match"` is returned unchanged.
       - `residentAttributeBytes` is unchanged: it already sums every object block's `bytes`, so the match column is counted in the sum.
     - **`values.ts`** (`frontends/shell/src/attributes/values.ts:54-69 @ 08ce9935 sha256:<H>`): a real edit inside values 40, in three parts.
       - `readRow` returns `"not-held"` for a `"match"` block, so its return type and its consumers are unchanged.
       - The match block's one-column copy is made here, so `data` is parsed nowhere else (§8 item 4).
       - The column reader (the ahead draft's column-reader paragraph) reads the key column from either kind of block, and gives null for a block that does not hold that column.
     - **`tableSource.ts`** (`frontends/shell/src/table/tableSource.ts:216-219 @ 08ce9935 sha256:<H>`, `frontends/shell/src/table/tableSource.ts:229 @ 08ce9935 sha256:<H>`): no edit. Its own decode never yields `"not-held"`, and the literal's type is unchanged. Amendment 12 item 4's condition stays unmet.
     - **The re-issue on a new column:** in App.tsx, inside App 165. A Colour-by whose column differs from the previous `fillMatch` column, or from none, while App's attributes-not-held state stands for the open, re-issues through App's existing `issueQueryRef` seam.
       - The seam: lines 1038-1040 and 1102-1109 of `frontends/shell/src/App.tsx` at 5b309b78. The candidate arm's binding is at line 1715 and the baseline's at line 1870. The state is at line 856.
       - The re-issue uses the active filter and the admitted-generation guard, and records no step.
       - The candidate arm's re-issue clears every tile and starts a fresh generation (`frontends/shell/src/residency/candidateArmSession.ts:1660-1667 @ 08ce9935 sha256:<H>`), so the map refills. See OPEN-4.
     - Copy (ADR-004): one named copy of one column, made only for a batch past the ceiling. It is unmeasured, and nothing claims a number (§6; docs/08).
   - **The worker's shape**, which replaces `"not-held"` with an object (`<R>`), is not taken. It breaks every `=== "not-held"` test. It needs a real edit in `tileResidentSet.ts`, with a test, and a narrowing in `tableSource.ts`, which triggers `tableSource.test.ts`.

3. **Files joining PR B's list (class 9), and the tests (class 9).**
   - `frontends/shell/src/canvas/decodeBatch.ts`: item 2's member, the literal's value, and the two doc comments that item 2 makes false. This is a type fill: it carries no §4 test.
   - `frontends/shell/src/canvas/WorkingCanvas.test.ts`: item 1's one null fill.
   - No other file joins. Before code, the custodian re-runs the probe (item 6) to confirm this.
   - The tests, each observed as §4 says (a `verify-mutation` run is not an observation):

     | ID | File | Asserts | Mutation; expected failure |
     |---|---|---|---|
     | PB-U10a | `limits.test.ts` | Built from the real `decodeBatch` over `testUtils/attributeBatchIpc.ts`. With the match column `tag` and the held bytes one under the ceiling, the batch comes back as a block with names `["tag"]`, `kept` `"match"` and `rows` null. `residentAttributeBytes` counts it. `readRow` gives `"not-held"`. The column reader gives the decode's `tag` values in order. The same batch, added through a real `TileResidentSet` with one duplicate, reads each kept row's own value. With the column null, the batch is `"not-held"`. | `withinAttributeCeiling` ignores the match column; fails at the names |
     | PB-U10b | `matchGroups.test.ts` | A match block gives the same per-row groups as the full block of the same decode. A block without that column, and `"not-held"`, give every row the group OPEN-3 settles. | the groups read only `"projection"` blocks; fails |
     | PB-U11 | `App.colour.test.tsx` | With the not-held state standing, a Colour-by on a new column issues one re-issue under the active filter, beside the cases query. With the same column, or with no not-held state, it issues none. Counted at the harness's stand-in, which is read as the transport boundary (Amendment 4 item 8). | skip the re-issue; the first case fails |

   - These replace the ahead draft's PB-U10. Each counts inside its file's existing ceiling.

4. **Ceilings (class 9; §7 not edited; counted by §7's command from 08ce993532d483f87ca0c50c2ee4e64f5863f020, Amendment 15 item 1).**

   | Addition | B-P | B-T |
   |---|---|---|
   | `frontends/shell/src/canvas/decodeBatch.ts` (item 2) | 16 | |
   | `frontends/shell/src/canvas/WorkingCanvas.test.ts` (item 1) | | 4 |

   - New totals:
     - B-P 1,752;
     - B-T 2,128, or 2,208 with Amendment 12 item 13's conditional entry;
     - B-E 590 (Amendment 14 item 1);
     - **PR B 4,470, or 4,550 with that entry.**
   - limits 25, values 40, WorkingCanvas 70, App's remainder (Amendment 15 item 3 (a)) and the three test files' ceilings are not raised. An overrun is class 8.

5. **What the stop makes untrue, read (class 1 unless named).**
   - Amendment 12 item 13's OPEN-20 (a) row is not the whole file set the ruling needs. Item 3 completes it.
   - The ahead draft's PB-U10 had no file and no defined mutation. Item 3 replaces it.
   - Amendment 3 item 9's §8 item 4 case "re-copies its attributes" names the trim and the duplicate drop. The ceiling's match block is the one named copy that OPEN-20 (a) requires, and it is not a rebuild.
   - Amendment 3 item 3's "No second map" still holds: a match block arrives at the drop with `rows` null.
   - The doc comments that item 2 makes false, in `decodeBatch.ts`, `limits.ts` and `values.ts`, are rewritten from the code inside Scope (class 3).
   - Item 51's words stay owed at the records commit (Amendment 12 item 7). They must state, from the code:
     - that the colour column is kept;
     - OPEN-2's bound;
     - OPEN-3's interim colour;
     - OPEN-4's camera.
   - Amendment 14 item 4 step (4) and Amendment 15 item 6's first bullet stay true: item 6 comes before them.

6. **The order (class 1).**
   - (1) This amendment on main, with its pins filled by script.
   - (2) The probe again at 5b309b78:
     - the type changes are §2.3 (a) and (b), Amendment 12 item 5's member, and item 2's `kept` with the literal filled;
     - then `npm run typecheck`;
     - a named file off the amended list is I1;
     - predicted sites: `document.test.ts`, `viewTransitions.test.ts` and `WorkingCanvas.test.ts` only.
   - (3) Rule (00) at dispatch, over `decodeBatch.ts` and `WorkingCanvas.test.ts`, against every branch then in progress or awaiting merge.
   - (4) Part 1's code. Before it, OPEN-2, OPEN-3 and OPEN-4 of the draft are settled (§8 item 20).
   - §5 for the addition:
     - **Declared unchanged:**
       - `tileResidentSet.ts`, `tileIngest.ts`, `tableSource.ts` and `decodeBatch.test.ts` are not edited;
       - every existing assertion in their tests, and in `values.test.ts`;
       - PA-U6's assertions, whose calls gain `null`;
       - `readRow`'s type;
       - the status item.
     - **Invalidators:** I1 is unchanged and covers the refill: a needed edit under `residency/` or `streaming/` is I1. I8 is unchanged.
   - §8 item 17's rebuild seam gains the match block, proven from the real decode by PB-U10a.
   - The reviewer adds:
     - the re-probe's list;
     - `decodeBatch.ts`'s diff holds item 2's edits alone, and `WorkingCanvas.test.ts`'s diff holds the one fill;
     - PB-U10a, PB-U10b and PB-U11's mutations, applied again.
   - The architect adds: item 2's block against §8 item 4 and ADR-004.

**Superseded for PR B:**
- the ahead draft's PB-U10 (item 3);
- Amendment 12 item 13's OPEN-20 (a) row, read as the whole file set (item 5).

Read the last amendment first.

Nothing above is edited.
```

**OPEN items**

- **OPEN-1: the not-held shape.** Not a red line.
  - **(a) The `kept` member on the block (item 2).** It adds 2 files, 20 lines in all.
  - **(b) The worker's shape**, where `"not-held"` becomes an object. Under (b), these join or are triggered:
    - `tileResidentSet.ts`: B-P 20, a real edit with its own test and mutation;
    - `tileResidentSet.test.ts`: B-T 40;
    - `tileIngest.test.ts`: B-T 4;
    - `tableSource.ts`: a narrowing, past Amendment 12 item 4's allowance, inside its 30;
    - `tableSource.test.ts`: 80, as Amendment 12 item 4's condition is then met;
    - `decodeBatch.ts`: 16;
    - `WorkingCanvas.test.ts`: 4.
    - That gives PR B about 4,614, with B-P 1,772 and B-T 2,252.
  - **Recommend (a).** It has fewer sites. It makes no edit to a file whose tests prove PA-U8 to PA-U10. The not-held literal keeps its meaning.
- **OPEN-2: is the kept match column itself bounded?**
  - (a) It is always kept and counted, so the total can pass 268,435,456 bytes by the match columns alone. Item 51 says so.
  - (b) A match block that would itself pass the ceiling falls back to `"not-held"`. Those features then draw by OPEN-3 for good. That is close to OPEN-20 (b), which was not taken.
  - **Recommend (a)**, as OPEN-20 (a) reads ("counted in the sum").
- **OPEN-3: what features without the current column draw as until the refill supersedes them.** These are not-held batches kept under another column, or under none.
  - (a) The resolver's unmatched (Other) group, through a style-ts accessor inside style-ts 40. No shell semantics are added (§8 item 6).
  - (b) Not drawn until they are superseded.
  - (c) The resolver's No value group.
  - **Recommend (a)**, named in item 51's words. This is a state an operator can see in ordinary use for one refill, so the words must state it.
- **OPEN-4: the camera on a refill.** The architect's reading of the code at 5b309b78, not confirmed by a run:
  - The shipped candidate arm's `reissueUnrestricted` calls `resetFitForNewGeneration`, so the first batch auto-fits the camera (`frontends/shell/src/canvas/WorkingCanvas.tsx:167-180 @ 08ce9935`).
  - A Colour-by on a new column while not-held stands would therefore move the view, as a filter Apply does.
  - (a) Accept it, and state it in item 51's words.
  - (b) Add `residency/candidateArmSession.ts` to PR B for a re-issue that does not fit. That crosses §2.6's "Not edited: `residency/`" and needs a ruling, not class 9 alone.
  - (c) Take the re-issue out of PR B, which falls back toward OPEN-20 (b).
  - **Recommend (a).** File a PLAN node for a refill that does not fit. This is for the advisor under the delegation of 2026-11-13; it does not change the human's OPEN-20 (a) ruling.

**Gate findings on the form as it stands**

- **Documentation, must-fix before the merge:**
  - Amendment 12 item 13's OPEN-20 (a) row left out `decodeBatch.ts`, where `ResidentBatch`'s type lives. The code at the time already showed the gap. This amendment's item 3 records it.
  - The ahead draft's PB-U10 mutation ("drop it") named no site. This amendment's item 3 replaces it.
  - §2.6's PR B count stays as Amendment 12's settlement, item 4, records it. It is not re-raised.
- **Correctness risk, before the re-issue's code:** OPEN-4. No Correctness or Evidence finding blocks the amendment.

**What I could not settle**

- **OPEN-4's camera move** is read from the code alone. The worker confirms it at the base, by reading each arm's re-issue path before code (seam rule), and reports it.
- **The re-probe's predicted sites** come from my type analysis, not a run. Item 6 (2) is the proof.
- **The reuse index.** My brief carried no reuse index. Under the standing step, the custodian adds the output of `reuse.mjs` or notes the miss.
- **The worker's evidence files.** `<S>/rep-m4b-cb1.md` and `<S>/m4b-cb1-probe-typecheck.txt` are untracked. `<R>` must be the filed path before this amendment lands on main (round 14: nothing tracked cites an untracked file as Authority; here it is cited as evidence).
