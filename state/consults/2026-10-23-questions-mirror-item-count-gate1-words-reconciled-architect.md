*Custodian's filing note (2026-10-23): the architect's reconciliation of #245's two gate 1 reports into one set of words, read only at main a585e84c with #245 at 0f93c122, a words consult with no verdict. The run 10:31:40Z to 10:35:45Z by its transcript (Read 10, Grep 7, Glob 2; no Write, Edit or Bash). Its item 2 and item 3 texts are the form's Amendment 2 and its item 5 text the form's Amendment 3, appended by the custodian in the same commit as this filing, with Amendment 3's rule (00) line filled by the branch diffs; its item 1 and item 5 README words are applied by a worker with no re-gate, and its PR body sentences by the custodian; its item 6 is the proposed node `questions-mirror-red-line-dotted-lead`. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 9df8247b02eb0cf68da28da724736e9bcd44da309927f57b26ae4a025a85b082.*

---

Reconciled: PR #245's gate 1 words, at main a585e84c

Branch and commit read: `cut/questions-mirror-item-count @ 0f93c12264879535ac40de1d87f0139bc927fbf5` (cited below as 0f93c122), in the worktree `C:/dev/wt/qmic`, with B at c7e94a85c5d21f3910c6c15ee9ce1d6071ca6189. This is a words consult, so it gives no verdict. I have no shell, so no cite below carries a sha256. Cites at the head use the words form, without a path:line token, because this report is filed outside `gates/`. None of the sentences below is the human's wording. The worker applies them with no re-gate, and the PR body lists them (AUTONOMY.md §31; the 2026-10-11 directive, item 2).

## 1. The doc comment: replaces lines 46-49 of `scripts/hooks/questions-mirror.mjs` at 0f93c122

This is the architect's text (`state/consults/gates/2026-10-23-questions-mirror-item-count-gate1-architect.md:16-20 @ a585e84c`), changed in three places:
- "(a hand-written one)" becomes "(some hand-written ones)". This is the reviewer's version. Hand-written rounds 2 to 15 count right.
- The reviewer's "counted as an item" and "can read high" are kept.
- The architect's "(its question or an option)" is kept, because options sit inside an item's paragraph.

```
/** Item count = the numbered items `1. `, `2. `, ... each opening a paragraph (the first line or a line after
 * an empty line), counted in order from 1. Best-effort, for the summary line only. Two limits: a file
 * whose items are not numbered `<n>. ` at a paragraph's start (some hand-written ones) is not counted by
 * its items, and counts 0 when no paragraph opens `1. `; and a paragraph inside an item's own text (its
 * question or an option) that opens with the next number in sequence is counted: the count can read high. */
```

Clause check against `scripts/hooks/questions-mirror.mjs` at 0f93c122:
- **"each opening a paragraph (the first line or a line after an empty line)":** `afterEmpty` starts true (line 52) and is set from `line === ''` (line 55). The split is on `\r?\n` (line 53).
- **"counted in order from 1":** `expected = 1` (line 51). The test at line 54 compares the number with `String(expected)`. Line 57 returns `expected - 1`.
- **"for the summary line only":** the only caller is `buildSummary` (line 62). The reviewer's caller grep finds `mirrorRound` (line 83) as its only product caller.
- **"not counted by its items":** line 54 reads only paragraph-opening `<n>. ` lines. Reviewer probe D gives 2 on an `Item <n>` file that holds a numbered answers list.
- **"counts 0 when no paragraph opens `1. `":** the first increment needs the string `"1"` (line 54).
- **"(its question or an option)":** `renderRound` joins the question and its option lines with `\n` (lines 151-158). An empty line inside either one therefore opens a paragraph inside the item.
- **"the next number in sequence is counted":** line 54 compares only against `expected`.
- **"can read high":**
  - In a file the hook wrote, every real item j opens a paragraph (line 159). By induction, `expected` is at least j+1 after item j, so the count is never below k.
  - An inner paragraph whose number runs past k gives more than k (reviewer probes B and C).
  - A non-last inner paragraph gives k (probe A), which "can" allows.
  - The words claim no bound of one.
- **§1 alignment:** the two limits are §1's two may-not-claims (`scripts/hooks/QUESTIONS-MIRROR-ITEM-COUNT-PREREGISTRATION.md:38-39 @ a585e84c`). "An option" is reconciled by item 2 of the item 2 amendment below, so §8 item 6 is met.

§7 figures: the comment goes from 4 lines to 5. All four head lines are already additions over B, so:
- the `.mjs` file is 16 added / 6 deleted = 22, ceiling 30;
- the test file is 41 / 3 = 44, ceiling 90;
- the total is 66, ceiling 120.

The worker confirms these with `git diff --numstat B...HEAD` before committing. The PR body's Scope line becomes:
```
66 lines over 2 files (`git diff --numstat c7e94a85...HEAD`), within §7's 30, 90 and 120.
```

## 2. The red-line claim

**Why:** the lead class in `^(?:[^.—\n]*?(?:\. | — ))?RED LINE` (line 128 of `scripts/hooks/questions-mirror.mjs` at 0f93c122) cannot cross a full stop, an em dash or a newline. "Label" is dropped, because `Do we proceed — RED LINE items stay held?` is listed (reviewer probe item 3).

**PR body, Summary, second sentence:**
```
The hook's header now lists a question as red-line when its text opens with `RED LINE`, or opens with a run of characters holding no full stop, em dash or newline, then `. ` or ` — `, then `RED LINE`, case-sensitive: `OPEN-1 — RED LINE` and `Do we proceed — RED LINE items stay held?` are listed; `§2.1 — RED LINE`, `AUTONOMY.md section 25 — RED LINE`, `Item 5. F — RED LINE` and a lower-case `red line` are not.
```

**Form, appended after Amendment 1** (append-only; class 1):
```
## §10 Amendment 2 — after gate 1: §1 may-claim 3 bounded by §7's pattern; the option text in §1's second may-not-claim; the bare test-file cites as pins (class 1); written by the custodian

*Written after the architect's and the reviewer's gate 1 results on PR #245 (post-result): `state/consults/gates/2026-10-23-questions-mirror-item-count-gate1-architect.md` and `state/consults/gates/2026-10-23-questions-mirror-item-count-gate1-reviewer.md`. They found §1 may-claim 3 wider than §7's pattern; no §3 or §4 prediction and no run changes.*

1. §1 may-claim 3 is bounded by §7's red-line pattern: a question is listed when its text opens with `RED LINE`, or opens with a run of characters holding no full stop, em dash or newline, then `. ` or ` — `, then `RED LINE`, case-sensitive; every other question is not listed. So `OPEN-1 — RED LINE` and `Do we proceed — RED LINE items stay held?` are listed, and `§2.1 — RED LINE`, `AUTONOMY.md section 25 — RED LINE` and `Item 5. F — RED LINE` are not. The claim's second sentence is read through this rule.
2. §1's second may-not-claim counts an item's option lines as part of its own text.
3. <the item 3 sentence below>
```

Clause check against line 128 and its call at line 145, `RED_LINE.test(q.question)`, of `scripts/hooks/questions-mirror.mjs` at 0f93c122:
- **Pattern parts:**
  - `^` with the optional group gives "opens with `RED LINE`, or opens with a run".
  - `[^.—\n]*?` is the run.
  - `(?:\. | — )` is the joiner.
  - There is no `i` flag, so the match is case-sensitive.
- **Traces:**
  - `OPEN-1` + ` — ` matches, and so does `Do we proceed` + ` — ` (reviewer probe items 4 and 3).
  - `§2` is followed by `.1`, `AUTONOMY` by `.m`, and `Item 5. ` by `F —`. The run cannot cross the `.`, so all three fail (architect's trace; reviewer probe items 1 and 2).
- **Agreement with the tests and runs:** T15's negative case `Was round 52 a RED LINE round?` has no joiner and gives `none` (lines 390-393 of `scripts/hooks/questions-mirror.test.mjs` at 0f93c122). It is consistent with "every other question is not listed". Reviewer I2 lists all 28 marker-bearing questions in rounds 36 to 73.
- **Not blocking:** an empty run, a question opening ` — RED LINE`, is also listed. "A run of characters" covers it, and ordinary rounds do not reach it.
- **Item 2:** see item 1's "(its question or an option)" check.

## 3. The form's bare cites into the test file (architect's D-1): amendment item 3

The architect located these in "§1, §2 and §4". They are in §0, §1 and §4:
- §0 has the test cite `:96`.
- §2.3's `:212` points into the round-mirror form, which this piece does not edit.

```
3. The bare line cites into `scripts/hooks/questions-mirror.test.mjs` in §0, §1 and §4 are historical pins read at 769c39af0ea83a245205d42e9817cba859372f1e, the commit the form's **Drafted by** line names, where that file is as at B (Amendment 1, item 1): the pin is authoritative for what the form describes, and the tree after this piece is not what they describe.
```

Clause check:
- The B-to-head offsets match the architect's table:
  - B's `:46-67` and `:64` are lines 47-68 and 65 at 0f93c122.
  - B's `:96` is line 97.
  - B's `:346-356` is lines 347-358, the M13 comment plus T13, with M18 inserted.
- The sentence names which is authoritative, so round 14's addition is met. It carries no `:line` token itself.

## 4. The PR body's ruling source (architect's D-2): replaces the Gates paragraph's second sentence

```
By the human's ruling in `state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md`, item 1, this PR and its gates run alongside verify-cites-pin (PLAN node `verify-cites-pin-resolution-and-line-zero`).
```

Clause check:
- The directive's item 1 is at `state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md:8 @ a585e84c`. It concerns questions-mirror's PR and gates running alongside verify-cites-pin.
- The node id is at `PLAN.yaml:4889 @ a585e84c`.
- The sentence paraphrases and carries no quotation marks.

## 5. The summary line in `scripts/hooks/README.md` (reviewer's D1)

**Recommendation: (a)**, a class 9 scope amendment in this PR, committed before the edit. Reasons:
- The standing directive `state/directives/2026-10-05-product-first-direction.md`, section 2, adds the work: a documentation finding is fixed in the same pull request before the merge. Class 9 (`docs/PREREGISTRATION-TEMPLATE.md:170 @ a585e84c`) is the declared route for work a standing rule adds. It does not bypass I4: once declared, I4 and §8 item 5 read against §7 as extended.
- Route (b) would merge a README line this PR makes untrue. The `1 item` case is reachable in ordinary use: a one-question round over 4096, as T13 shows.
- Before the edit, the custodian re-runs rule (00) by branch diffs on the added path, especially verify-cites-pin running alongside, and records the result in the amendment.

**Amendment, appended after Amendment 2:**
```
## §10 Amendment 3 — scope addition: the README's summary sentence (class 9); written by the custodian

*Scope addition, on the standing directive `state/directives/2026-10-05-product-first-direction.md`, section 2, after the reviewer's gate 1 finding D1; committed before the edit.*

- §2: in `scripts/hooks/README.md`, the sentence giving the `> 4096` summary message's shape states §2.3's three cases. No code changes.
- §4: no test and no mutation; the edit is prose and no behaviour moves.
- §5: unchanged as §5 states; I4 is read against §7 as this amendment extends it. Invalidator: any other README text changed.
- §7: `scripts/hooks/README.md`, at most 4 lines by `git diff --numstat B...HEAD -- scripts/hooks/README.md`, outside the two-file total.
- §8: item 5 reads §7 as extended. §9: unchanged.
- Rule (00) for the added path: <branch diffs at this commit>.
```

**README words:** these replace the parenthesis that begins the line `(`Question round <n> — <k> items; ...`) **then** `sendDocument``, which is line 254 at 0f93c122. They come to 3 added and 1 deleted, so 4 lines.
```
(`Question round <n> — <k> items; full text attached (copy-paste ready)`; `<k>` counts the numbered
items that open a paragraph, in order from `1. `; a count of one gives `1 item;`, and a count of 0 is
left out) **then** `sendDocument`
```

Clause check against `scripts/hooks/questions-mirror.mjs` at 0f93c122:
- "counts the numbered items that open a paragraph, in order from `1. `": lines 51-57.
- "a count of one gives `1 item;`": line 63.
- "a count of 0 is left out": line 63 gives `''` for `n === 0`, and line 64 joins it.

The PR body's Scope line then adds:
```
and 4 lines in `scripts/hooks/README.md` under Amendment 3 (class 9), within its 4.
```

If (b) is chosen instead, the same three lines become the proposed node's change.

## 6. The candidate both gates name: one line for a proposed node

```
questions-mirror-red-line-dotted-lead: the hook's header reads `none` for a question whose red-line marker follows a lead holding a full stop (`§2.1 — RED LINE`, `AUTONOMY.md section 25 — RED LINE`), because §7's lead class excludes `.`; widen the lead, or keep it and state the limit, under its own form, after questions-mirror-item-count merges.
```

Sources: `state/consults/gates/2026-10-23-questions-mirror-item-count-gate1-architect.md:46 @ a585e84c`; `state/consults/gates/2026-10-23-questions-mirror-item-count-gate1-reviewer.md:38 @ a585e84c`.
