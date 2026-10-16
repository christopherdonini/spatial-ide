Addendum to the gate 3 architect report: PR #222 at 3e63a839d195f96f3d20796ef78133633984d55a (cut/b2-piece-1b-recording @ 3e63a839d195f96f3d20796ef78133633984d55a). This answers the custodian's request on console.mjs:277. Read-only; I wrote no file. The verdict stays PASS WITH NOTES.

The comment should change in this PR. The re-aim at 7b547f90 is this PR's own commit, and that re-aim is what made the comment untrue. It is not the human's wording, so it goes into the same words-only commit as ND-6, with no re-gate, and the PR body lists it. This moves it from my out-of-scope note to a Documentation finding, ND-7, which must be fixed before the merge.

**ND-7. The comment on `GROUP_CALLS` describes GROUP' as it ran before the re-aim.**
- **Where:** frontends/shell/e2e/console.mjs:277.
- **What it says now:** GROUP' makes identical calls and expects a residential-row count. At the head, GROUP' makes style edits and counts `style.set` `record_step` rows.
- **Old text to replace** (the comment only; the line's code `const GROUP_CALLS = 3;` stays):
```text
// the number of identical calls, and the expected residential-row count (Amendment 2 item 2)
```
- **New text:**
```text
// the number of style edits GROUP' makes, each to a distinct fill colour, and the number of `style.set` `record_step` rows it expects above its baseline; at most 3, the fills `stepGroup` lists (re-aimed by kernel/B2-1B-RECORDING-PREREGISTRATION.md Amendment 6)
```
- **Clause check at 3e63a839:**
  - *The number of style edits GROUP' makes:* holds. One `page.fill` runs per entry of `fills`, which is sliced to `GROUP_CALLS` (:716-721). The error at :719 counts the edits against `GROUP_CALLS`.
  - *Each to a distinct fill colour:* holds. The three fills at :716 are `#223344`, `#334455` and `#445566`, all different.
  - *The number of `style.set` `record_step` rows it expects above its baseline:* holds.
    - `baseRes` is the count before the edits (:709).
    - The poll waits for `baseRes + GROUP_CALLS` rows (:728).
    - The presence error (:740) and the return text (:828) state the same expectation.
    - `isStyleStep` matches only `a:record_step` rows whose action is `style.set` (:692-699).
  - *At most 3, the fills `stepGroup` lists:* holds. `.slice(0, GROUP_CALLS)` on a three-entry array (:716) yields at most three edits. A larger value would expect rows that no edit makes, so the poll would fail at `presence`. The clause discloses that bound.
  - *Re-aimed by kernel/B2-1B-RECORDING-PREREGISTRATION.md Amendment 6:* holds as the file itself records it. The approved JSDoc names that form and amendment for the re-aim (:593-594, and :664 for GROUP').
  - *Dropped:* `(Amendment 2 item 2)` is removed. That item is in frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md (its :585-588), and it defines the residential count this comment no longer describes. The approved JSDoc at :664-666 keeps the history of the old step, so no record is lost.
- **Line length:** the line passes 100 columns. That is a matter for the e2e formatter, if one runs over `.mjs` files, and not for this gate. If the worker wraps the comment, it goes on the lines above the `const`, with the words unchanged.

The rest of my report stands as delivered, ND-6 included. The worker applies ND-6 and ND-7 together, in one words-only commit.

Relevant file:
- C:/dev/wt/1b/frontends/shell/e2e/console.mjs
