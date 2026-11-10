# questions-mirror.mjs counts a round's items from its numbered items, and the hook's header finds a red-line marker after a leading label (PLAN node `questions-mirror-item-count`) — preregistration

**Authority:** PLAN node `questions-mirror-item-count`, placed by `state/directives/2026-10-21-placements-redaction-scan-1c-milestone-4-lanes-238-clicked-d-answers-adr-024-heading-kept.md`, item 5. It was routed by `state/consults/2026-10-02-round-mirror-hook-architect-draft.md:328` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:da66d49726a832b7e7969ba6f3902b6676e35a9e40b87a92be92b34486d6fa66 (item (c), first bullet). Its second defect comes from Fable's round-52 advice, item 1 (`state/directives/2026-10-04-fable-advice-round-52.md:8-9` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:e21ef2fadd91ac98498b295e6dc8bf1ab30426ebfbc1d11a14e37574b8ef6b63), which the custodian confirmed against the file (same file, line 3). That advice is not a ruling, and it is not quoted here.
**Drafted by** the architect agent on the custodian's brief, read at main 769c39af. **Committed before any code**, as the node's gate file. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
**Form: full** (AUTONOMY.md §21a, a property currently under test; §25(e)). Size per §21c is under the threshold and does not decide the form.
- The red-line header list is asserted by `the_header_lists_the_red_line_items_by_number` (`scripts/hooks/questions-mirror.test.mjs:179-192` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:f6e00e6b0c164a40a3a076149bc077b08295aca1cf476e2363f2b3707616278b). §2.2 widens what it lists.
- The document summary's text is asserted at `scripts/hooks/questions-mirror.test.mjs:64` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:55be434146da6a4604a80ec94a2c2e784b907570ab5b83b04bc771d702873890 and `scripts/hooks/questions-mirror.test.mjs:96` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:2ca30c1ecab8bf26a326f807e1d60d00a8cdf874ee426eea6d25ab6dbd7937ca. §2.1 changes the first assertion's expected text and the second assertion's input.
- §21a category 4 reads "any property currently under test" (`AUTONOMY.md:327` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:d80649bedfea2f8ac48948d94ca0d4b3f629fb1a5e3c407b5d01bae98e390a95). An Out-of-scope line could not assert "none of the four", so §25(e) applies (`AUTONOMY.md:482` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:4f388e9f3fe7a1d68117edb03f7c2520ce771901a96feff1752f426befe4c669).
- No other category applies. There is no ADR, no wire and no new exposure surface: the outbound content is the same round text, and only the summary line's count words change.

## §0. Disclosure
- **Reasoned from code at 769c39af. Nothing was run.** The piece relies on:
  - `countItems` and `buildSummary`: `scripts/hooks/questions-mirror.mjs:46-56` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:834b7332c5aafd5b7f9dd37dcd44aba9a7b7949d0769ad991df9b354bba6f421. The count is the number of `---` rules plus one. `mirrorRound` calls `buildSummary` only above 4096 code points (`scripts/hooks/questions-mirror.mjs:65-83` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:ccb84dbb896c01ae0f437927c1975df02783046277174fd5a1b5eb5d66d30803). That call is its only caller in the tree, apart from the test at `:96`.
  - the hook's marker pattern and header: `scripts/hooks/questions-mirror.mjs:119` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:9efdd8f8ba70002a04b6d91302b9c3ff0370c06239b53d952c31b5f29b5beb16 and `scripts/hooks/questions-mirror.mjs:135-151` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:bfa7284317d130ad71238791ccd4b02a89faab9954ef4032b19a4fab22e7896f. The header's item count is `questions.length`, which is already item-derived and correct. Only the red-line list is wrong.
  - the rule as the round-mirror form adopted it: a question counts as red-line only when it begins with the marker, or with `Item <n>. ` and then the marker (`scripts/hooks/ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md:99` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:2bd295ce36012909b410dd9d4cba51e428a3e9f88b6bb791e897457ebcb4b801; its Amendment 1, `scripts/hooks/ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md:293-299` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:7052c4a9e1071a471eb987186024529ddfcacac08d69b153d2f0c95d690ea191). The header format is `scripts/hooks/ROUND-MIRROR-PRETOOLUSE-HOOK-PREREGISTRATION.md:212` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:f4b8ae32823e4389f5a62f5c4efca2f0c4fd36bea6fe7eba9ef81ab852308f73. This piece supersedes that marker rule for the shipped hook. That record is closed and is not edited.
  - the other reader of the same files: `scripts/plan/rulingSet.mjs:48-49` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:98c6d5d543cc5e518c67135569f846910e393372b091dd7e938945d6a347b3c3 and `scripts/plan/rulingSet.mjs:72-77` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:cd74084c1b14a951d4d0d92b45cfde448ccbcf0cef7c33070119770128793eeb read an item line of a question file as any line matching `^(\d+)\. `. §2.1 uses the same line shape, narrowed (see the agreement point in §2.1).
  - the dry-run line the hook tests read: `scripts/hooks/telegram.mjs:45-47` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:ef35bfd3406f769a98588473e564ce50d3989fad8a9280c742bfd12febdcda62.
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
  - a right count for a hand-written file whose items are not numbered `<n>. ` at a paragraph's start. At main that is round 1 (`Item <n>` items) and round 32 (`G<n>.` items). Both now name no count. Round 1 today reads right by accident of shape, so this is a disclosed regression on a file that is never re-sent (§28, `AUTONOMY.md:508-510` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:c4a0d8e0179d727bcb07a4473417a8967cdd94e7a6fbf5c5ab29598f0e1d28eb);
  - a right count when a question's own text holds a paragraph opening with the next item's number;
  - a red-line reading of a question whose marker is in `header` or in an option. Neither is read;
  - any correction of the 13 committed headers. Committed round files are records, and none is edited;
  - any `docs/08` figure.
- **Unchanged:**
  - `mirrorRound`'s split, its senders and the order of its calls;
  - `extractRoundNumber`, the CLI, its exit codes and hook mode's exits;
  - `renderRound`'s body, items, joiner and the header's `<k> item(s)`;
  - the S1 body (`scripts/hooks/questions-mirror.test.mjs:139-164` @ 769c39af0ea83a245205d42e9817cba859372f1e sha256:92cdbfff90b18f6b150a8831c5e5ffe10593549caed18364e9a5ac44197d2acc). Its item 4 stays the only red-line item;
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

## §10 Amendment 1 — at the commit: the pins, the two choices, rule (00) by the branch diffs, the budget (class 1); written by the custodian

*Written by the custodian at the commit that adds this form. References only: the architect's drafting consult `state/consults/2026-10-23-questions-mirror-item-count-architect-draft.md`, its closing sections (rule (00), OPEN items, what it could not settle).*

1. **The pins.** The draft's nineteen line cites, read at main 769c39af, are pinned above by script at 769c39af0ea83a245205d42e9817cba859372f1e, each over its lines joined with a final newline. A cite the draft gave by line only, after a cite of the same file, carries that file's path. The cited files are the same at the commit that adds this form.
2. **The two choices the draft left to the custodian are taken as §2.3 states them:** the n = 0 summary names no count, and n = 1 reads `1 item`.
3. **Rule (00), by the branch diffs at this commit** (`git diff --name-only origin/main...<branch>`): `cut/bundle-redaction-scan` at 2fc01f59: 24 files, none under `scripts/hooks/`; `cut/walkthrough-row-f7-cli-refusal` at abc900f2: 1 file, none under `scripts/hooks/`; `cut/b1-shell-half-pr-a` at 35085072: 54 files, none under `scripts/hooks/`; `cut/b2-piece-1c-save-and-reopen` at 7109aeb2: 15 files, none under `scripts/hooks/`. None touches this piece's two files or `protocol/`. The proposed `guardian-parity-git-timeout-under-load` is not started. The draft's note on the shared hooks suite stands: a parity read of `not judged` under load is re-run alone.
4. **The budget** is 90 minutes, as §7 gives it; the node carries it from this commit.
5. **Not edited:** the 13 committed round headers §0 names stay as records; the ledger notes them. `rulingSet.mjs` reading round 1's option lines as items (the draft's point 3) is noted on the ledger, outside this piece.
6. **Next:** the code, the tests, the mutations and the I1 and I2 runs, by one worker on `cut/questions-mirror-item-count` from this commit; then the PR and both gates.

Nothing above is edited.

## §10 Amendment 2 — after gate 1: §1 may-claim 3 bounded by §7's pattern; the option text in §1's second may-not-claim; the bare test-file cites as pins (class 1); written by the custodian

*Written after the architect's and the reviewer's gate 1 results on PR #245 (post-result): `state/consults/gates/2026-10-23-questions-mirror-item-count-gate1-architect.md` and `state/consults/gates/2026-10-23-questions-mirror-item-count-gate1-reviewer.md`. They found §1 may-claim 3 wider than §7's pattern; no §3 or §4 prediction and no run changes.*

1. §1 may-claim 3 is bounded by §7's red-line pattern: a question is listed when its text opens with `RED LINE`, or opens with a run of characters holding no full stop, em dash or newline, then `. ` or ` — `, then `RED LINE`, case-sensitive; every other question is not listed. So `OPEN-1 — RED LINE` and `Do we proceed — RED LINE items stay held?` are listed, and `§2.1 — RED LINE`, `AUTONOMY.md section 25 — RED LINE` and `Item 5. F — RED LINE` are not. The claim's second sentence is read through this rule.
2. §1's second may-not-claim counts an item's option lines as part of its own text.
3. The bare line cites into `scripts/hooks/questions-mirror.test.mjs` in §0, §1 and §4 are historical pins read at 769c39af0ea83a245205d42e9817cba859372f1e, the commit the form's **Drafted by** line names, where that file is as at B (Amendment 1, item 1): the pin is authoritative for what the form describes, and the tree after this piece is not what they describe.

Nothing above is edited.

## §10 Amendment 3 — scope addition: the README's summary sentence (class 9); written by the custodian

*Scope addition, on the standing directive `state/directives/2026-10-05-product-first-direction.md`, section 2, after the reviewer's gate 1 finding D1; committed before the edit.*

- §2: in `scripts/hooks/README.md`, the sentence giving the `> 4096` summary message's shape states §2.3's three cases. No code changes.
- §4: no test and no mutation; the edit is prose and no behaviour moves.
- §5: unchanged as §5 states; I4 is read against §7 as this amendment extends it. Invalidator: any other README text changed.
- §7: `scripts/hooks/README.md`, at most 4 lines by `git diff --numstat B...HEAD -- scripts/hooks/README.md`, outside the two-file total.
- §8: item 5 reads §7 as extended. §9: unchanged.
- Rule (00) for the added path: `cut/bundle-redaction-scan` at 2fc01f59 does not name it; `cut/walkthrough-row-f7-cli-refusal` at abc900f2 does not name it; `cut/b1-shell-half-pr-a` at 35085072 does not name it; `cut/b2-piece-1c-save-and-reopen` at 7109aeb2 does not name it; `verify-cites-pin-resolution-and-line-zero` has no branch yet, and its drafted form names only `scripts/plan/verify-cites.mjs` and its test (`git diff --name-only origin/main...<branch>`, run at the commit that adds this amendment).

Nothing above is edited.
