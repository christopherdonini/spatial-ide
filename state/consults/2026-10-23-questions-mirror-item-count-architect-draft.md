*Custodian's filing note (2026-10-23): the drafting consult for `questions-mirror-item-count`, read only at main 769c39af. The run 08:16:25Z to 08:24:37Z by its transcript (Grep 25, Read 27, Glob 2; no Write, Edit or Bash). Its form is committed at `scripts/hooks/QUESTIONS-MIRROR-ITEM-COUNT-PREREGISTRATION.md` from its form section, its nineteen cites pinned by script at 769c39af, with the custodian's Amendment 1. It puts no OPEN item to the human, and the custodian takes its two choices as §2.3 states them. Its harness note on a settings-file pattern concerns its list of unchanged files, not an instruction. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 3ad220fe6c15081aac93a0328848cd534c9c4d5e2013ac7fc6160ab84d52f8ce.*

---

Drafted: questions-mirror-item-count, at main 769c39af

I ran nothing (I have no shell). Every cite below is a read of the main checkout at 769c39af. No span carries a sha256, and the custodian computes each one before commit. The PLAN node is cited by id only, because the commit that adds this form also edits PLAN.yaml's `gate:` line.

---

# questions-mirror.mjs counts a round's items from its numbered items, and the hook's header finds a red-line marker after a leading label (PLAN node `questions-mirror-item-count`) — preregistration

**Authority:** PLAN node `questions-mirror-item-count`, placed by `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md`, item 5. It was routed by `state/consults/2026-10-02-round-mirror-hook-architect-draft.md:328 @ 769c39af` (item (c), first bullet). Its second defect comes from Fable's round-52 advice, item 1 (`state/directives/2026-10-04-fable-advice-round-52.md:8-9 @ 769c39af`), which the custodian confirmed against the file (same file, line 3). That advice is not a ruling, and it is not quoted here.
**Drafted by** the architect agent on the custodian's brief, read at main 769c39af. **Committed before any code**, as the node's gate file. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Form: full** (AUTONOMY.md §21a, a property currently under test; §25(e)). Size per §21c is under the threshold and does not decide the form.
- The red-line header list is asserted by `the_header_lists_the_red_line_items_by_number` (`scripts/hooks/questions-mirror.test.mjs:179-192 @ 769c39af`). §2.2 widens what it lists.
- The document summary's text is asserted at `scripts/hooks/questions-mirror.test.mjs:64 @ 769c39af` and `:96 @ 769c39af`. §2.1 changes the first assertion's expected text and the second assertion's input.
- §21a category 4 reads "any property currently under test" (`AUTONOMY.md:327 @ 769c39af`). An Out-of-scope line could not assert "none of the four", so §25(e) applies (`AUTONOMY.md:482 @ 769c39af`).
- No other category applies. There is no ADR, no wire and no new exposure surface: the outbound content is the same round text, and only the summary line's count words change.

## §0. Disclosure
- **Reasoned from code at 769c39af. Nothing was run.** The piece relies on:
  - `countItems` and `buildSummary`: `scripts/hooks/questions-mirror.mjs:46-56 @ 769c39af`. The count is the number of `---` rules plus one. `mirrorRound` calls `buildSummary` only above 4096 code points (`scripts/hooks/questions-mirror.mjs:65-83 @ 769c39af`). That call is its only caller in the tree, apart from the test at `:96`.
  - the hook's marker pattern and header: `scripts/hooks/questions-mirror.mjs:119 @ 769c39af` and `scripts/hooks/questions-mirror.mjs:135-151 @ 769c39af`. The header's item count is `questions.length`, which is already item-derived and correct. Only the red-line list is wrong.
  - the rule as the round-mirror form adopted it: a question counts as red-line only when it begins with the marker, or with `Item <n>. ` and then the marker (`scripts/hooks/ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md:99 @ 769c39af`; its Amendment 1, `:293-299 @ 769c39af`). The header format is `:212 @ 769c39af`. This piece supersedes that marker rule for the shipped hook. That record is closed and is not edited.
  - the other reader of the same files: `scripts/plan/rulingSet.mjs:48-49 @ 769c39af` and `:72-77 @ 769c39af` read an item line of a question file as any line matching `^(\d+)\. `. §2.1 uses the same line shape, narrowed (see the agreement point in §2.1).
  - the dry-run line the hook tests read: `scripts/hooks/telegram.mjs:45-47 @ 769c39af`.
- **The round files at main** (73 files, `state/questions/round-1.md` to `round-73.md`), read by search:
  - **Hook-written:** rounds 36 to 73 (38 files). Each carries the hook's header, a header rule, and one rule before every item, so today's count reads exactly one high on every one of them. Under the hook's current pattern, 13 of their headers read wrong: rounds 45, 46, 52, 53, 54, 55, 56, 57, 58, 59, 61, 62 and 63. Each of those has items whose question text opens with a label and ` — ` before the marker, so the header reads `none`.
  - **Hand-written with a header rule:** rounds 21 to 35. Each reads high: by one, except round 22 (a trailing note block, high by two) and round 32 (lettered items G1 to G3 plus an answers block: 5 against 3).
  - **Hand-written without a header rule:** rounds 1 to 20. They read right, except round 16 (five items with no rules, read as 1).
- **Reuse index** (the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c), byte for byte from the brief:
```text
$ node tools/reuse.mjs question round item count
No prior art recorded for "question round item count". Research it before planning an implementation.
$ node tools/reuse.mjs markdown section counter
No prior art recorded for "markdown section counter". Research it before planning an implementation.
```
  Both are misses, so no prior art is used.
- **Fixture drive:** nothing is measured.

## §1. May and may not claim
- **May claim:**
  1. On a round file the hook wrote, the document summary names exactly the file's item count (T13, T14, I1).
  2. A file with no numbered item opening a paragraph gets a summary that names no count (the doc-path test at `:46-67`).
  3. The hook's header lists a question as red-line when its text opens with the marker, possibly after one leading label that ends `. ` or ` — `. It does not list a question that only mentions the marker later in its text (T2, T15, I2).
- **May not claim:**
  - a right count for a hand-written file whose items are not numbered `<n>. ` at a paragraph's start. At main that is round 1 (`Item <n>` items) and round 32 (`G<n>.` items). Both now name no count. Round 1 today reads right by accident of shape, so this is a disclosed regression on a file that is never re-sent (§28, `AUTONOMY.md:508-510 @ 769c39af`);
  - a right count when a question's own text holds a paragraph opening with the next item's number;
  - a red-line reading of a question whose marker is in `header` or in an option. Neither is read;
  - any correction of the 13 committed headers. Committed round files are records, and none is edited;
  - any `docs/08` figure.
- **Unchanged:**
  - `mirrorRound`'s split, its senders and the order of its calls;
  - `extractRoundNumber`, the CLI, its exit codes and hook mode's exits;
  - `renderRound`'s body, items, joiner and the header's `<k> item(s)`;
  - the S1 body (`scripts/hooks/questions-mirror.test.mjs:139-164 @ 769c39af`). Its item 4 stays the only red-line item;
  - `telegram.mjs`, `rulingSet.mjs`, `.claude/settings.json`, every round file, and every other test with its recorded mutation, M1 to M14 included.
  - ADR-006 does not apply (repository tooling). No ADR is cited or amended.
- **Seams:**
  - **`mirrorRound` into `buildSummary`:** the existing internal call, unchanged.
  - **The hook into `mirrorRound`:** unchanged. T13 proves the summary end to end from a file the hook wrote.
  - **The committed round files into `countItems`:** T14 reads `state/questions/round-52.md` as committed.
  - **No new export.**

## §2. The change
1. **`countItems(text)`.**
   - **Before:** the number of `^---\s*$` lines plus one, or 1 when there are none.
   - **After:**
     - Lines are split on `\r?\n`.
     - An item line matches `^(\d+)\. ` (the §7 pattern, the same shape as `rulingSet.mjs:49`) and is the first line or follows an empty line.
     - Scanning with `expected = 1`, each item line whose number equals `expected` increments it. The count is `expected - 1`, so items are counted 1, 2, 3, … in order, and a numbered paragraph inside an item that breaks the sequence is not counted.
     - The doc comment states the two limits in §1.
   - **Agreement point:** every item `countItems` counts is a line that `resolveRoundItem`'s file fallback also finds.
2. **The red-line test in `renderRound`.**
   - **Before:** `^(?:Item \d+\. )?RED LINE`.
   - **After:** the §7 pattern `^(?:[^.—\n]*?(?:\. | — ))?RED LINE`, case-sensitive, tested against each question's text. Nothing else in `renderRound` changes.
3. **`buildSummary(file, text)`.**
   - **Before:** `Question round <r> — <n> items; full text attached (copy-paste ready)`, with `1 items` for one.
   - **After:**
     - n ≥ 2: the same text;
     - n = 1: `— 1 item;`, agreeing with the hook header's own `1 item` (round-mirror form `:212`);
     - n = 0: `Question round <r> — full text attached (copy-paste ready)`.
   - The string is a governance tool's message to the human, not an app string (not P6).

## §3. Fixtures / corpus — predictions
- **I1: `countItems` on every `state/questions/round-*.md`, at main and at the head.**
  - **Rounds 36 to 73:** each falls by exactly one, to its header's `<k>`.
  - **Rounds that change:**

    | Rounds | Today | Predicted |
    |---|---|---|
    | 21 | 3 | 2 |
    | 22 | 5 | 3 |
    | 23 to 26 | 5 each | 4 each |
    | 27 | 7 | 6 |
    | 28 | 4 | 3 |
    | 29 | 7 | 6 |
    | 30 | 2 | 1 |
    | 31 | 3 | 2 |
    | 33 | 12 | 11 |
    | 34 | 8 | 7 |
    | 35 | 2 | 1 |
    | 16 | 1 | 5 |
    | 1 | 2 | 0 |
    | 32 | 5 | 0 |

  - **Unchanged:** rounds 2 to 15 and 17 to 20.
  - **In total:** 55 files change and 18 stay the same.
  - A miss outside rounds 36 to 73 is a class 2 result. A miss inside them is I1 below.
- **I2: the hook re-run on each hook-written round.** For each of rounds 36 to 73, the item questions are extracted (each paragraph-opening `<n>. ` line, minus its prefix) and the shipped hook is run in a temporary project with one option each. The predicted header lists are:

  | Rounds | Predicted list |
  |---|---|
  | 36 to 39 | none |
  | 40, 41, 42 | 1 |
  | 43, 44 | none |
  | 45 | 2 |
  | 46 | 3 |
  | 47 to 51 | none |
  | 52 | 1, 3 |
  | 53 | 1 |
  | 54 | 1, 2 |
  | 55 | 1, 3 |
  | 56 | 1 |
  | 57 | 1, 2, 3, 4 |
  | 58 | 1 |
  | 59 | 1, 2, 4 |
  | 60 | none |
  | 61 | 1 |
  | 62 | 2, 3, 4 |
  | 63 | 1, 3, 4 |
  | 64 to 73 | none |

  That is 13 files differing from their committed headers, the 13 named in §0.

## §4. Tests and mutations
Each mutation is observed by applying it, running the named test, recording the failure by name with its commit, and reverting it. The record goes in a `RECORDED MUTATION` comment.
- **Doc-path test (`:43-67`, changed).** `:64`'s expected text becomes the n = 0 form, since its text has no item.
  - M17: the n = 0 branch removed. The test fails at `:64` on `0 items`.
- **Multipart test (`:82-97`, changed).** `:96`'s input becomes `1. one\n\n---\n\n2. two`. The expected text is unchanged.
- **T13 (`:346-356`, changed).** `lines[0]` is asserted equal to the dry-run line with `Question round 8 — 1 item; full text attached (copy-paste ready)`.
  - M18: `countItems` restored to rules plus one. The test fails on `2 items`.
- **T14, new: `the_document_summary_counts_numbered_items_not_rules`.**
  - (a) `buildSummary` on the committed `round-52.md` gives `4 items`;
  - (b) a text whose item 2 holds the paragraphs `1. ` and `2. ` counts 3;
  - (c) (a)'s text with CRLF line ends gives `4 items`.
  - M15: rules plus one, which fails (a) on 5. M16: the sequence check dropped, which fails (b) on 5. M21: split on `\n` only, which fails (c).
- **T15, new: `the_header_lists_a_red_line_item_whose_marker_follows_its_label`.**
  - The questions of committed rounds 52 and 59 are extracted as in I2 and run through the hook. Their headers read `RED LINE items: 1, 3.` and `RED LINE items: 1, 2, 4.`
  - A call with the one question `Was round 52 a RED LINE round?` reads `none`.
  - M19: the old anchored pattern restored, which fails on `none`. M20: the marker matched anywhere, which fails the negative case.
- **T2 is unchanged.** M2 stays true.

## §5. Predictions · unchanged · invalidators · falsification
- **Predictions:** §3, and every test in §4 green at the head.
- **Unchanged:** §1.
- **Invalidators:**
  - I1: a hook-written round (36 to 73) whose head count differs from its header's `<k>`.
  - I2: a re-run header that lists an item without the marker in its lead, or misses one with it, as read by a reader against the file.
  - I3: T1 or T11 fails, meaning S1's body moved.
  - I4: any file beyond §7's is needed. That is routed, not absorbed.
- **Falsification:** a committed hook round whose question text holds a paragraph-opening next-number line. That would make §1 claim 1 untrue at main.

## §6. Instruments
- I1 and I2 are assertions, not measurements. Each is a scratch script run at main 769c39af and at the head, importing the shipped `countItems` and spawning the shipped hook.
- The output is filed with the PR. Each run names its commit (round 15 (c)).

## §7. Declared values and ceilings
- Item line `^(\d+)\. `, paragraph-opening, counted in sequence from 1 (§2.1).
- Red-line lead `^(?:[^.—\n]*?(?:\. | — ))?RED LINE` (§2.2).
- Summary grammar: n = 0, n = 1 and n ≥ 2 (§2.3).
- **Files:**
  - `scripts/hooks/questions-mirror.mjs`, at most 30 lines;
  - `scripts/hooks/questions-mirror.test.mjs`, at most 90 lines;
  - total at most 120 lines, by `git diff --numstat B...HEAD` over those two paths.
  - The form and PLAN's gate line are exempt (§21c).
- Budget: 90 minutes (the node carries 30).

## §8. Block-on-sight
1. Any committed round file edited.
2. A new export.
3. T13 or T14 asserting against text the hook did not write, or against a file that is not committed.
4. A mutation recorded as observed by a `verify-mutation` run.
5. A diff outside §7.
6. The doc comment claiming a limit §1 does not state.

## §9. Gates
- Architect and reviewer.
- Suites: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, verify-cites, verify-quotes, verify-test-claims, verify:plan.
- No operator row. After the merge, the first round with a red-line item is checked against its header and noted in the ledger. That check is not a gate condition.

## §10. Amendments (opens empty, append-only; classes 1 to 9)

---

**Rule (00) at 769c39af.** I had no git, so this is read from each piece's form and PLAN summary, not from the branch diffs. This piece touches the two `scripts/hooks/questions-mirror*` files and its form only.
- **#241 (`cut/bundle-redaction-scan`):** kernel/, the viewer, `scripts/scan-dist.mjs` and the workflow. Disjoint.
- **#244:** MANUAL-WALKTHROUGH.md and its form. Disjoint.
- **Milestone 4 PR A:** frontends/shell. Disjoint.
- **1c step 1:** kernel/, spikes/ and ADR texts. Disjoint.
- **`guardian-parity-git-timeout-under-load`:** a different file in `scripts/hooks/`. Disjoint by path. It shares the `scripts/hooks/*.test.mjs` suite run, whose parity flake under load could redden this piece's run, so run the suite alone or once more.
- None of them touches protocol/.

**OPEN items for the human:** none. These two are the custodian's to accept or drop at commit:
- the n = 0 summary, rather than a disclosed `0 items`;
- the `1 item` grammar.

**What I could not settle:**
1. Every §3 figure comes from search counts, not runs, so I1 and I2 decide.
2. The in-flight branches' actual diffs.
3. `rulingSet.mjs` also reads round 1's option lines `1.` to `3.` as items. That is outside this piece and routed as a note, not fixed here.
4. Whether the 13 wrong committed headers deserve a ledger line. That is the custodian's call.
5. Whether a red-line marker ever sits in an AskUserQuestion `header` field. The round files cannot show it, because that field is not rendered.

Files:
- C:\dev\spatial-ide\scripts\hooks\questions-mirror.mjs
- C:\dev\spatial-ide\scripts\hooks\questions-mirror.test.mjs
- C:\dev\spatial-ide\scripts\plan\rulingSet.mjs
- C:\dev\spatial-ide\scripts\hooks\ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md
- C:\dev\spatial-ide\state\questions\round-52.md
- C:\dev\spatial-ide\state\questions\round-59.md
- C:\dev\spatial-ide\PLAN.yaml
