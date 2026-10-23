*Custodian's filing note (2026-10-23): the architect's one set of words for #247's gate 1, reconciled from both gates' reports (`state/consults/gates/2026-10-23-verify-cites-pin-resolution-and-line-zero-gate1-architect.md`, `state/consults/gates/2026-10-23-verify-cites-pin-resolution-and-line-zero-gate1-reviewer.md`), read only at the head 7a23dbad. The run 13:26:15Z to 13:31:41Z by its transcript (Read 7, Grep 3; no Write, Edit or Bash). None of these words is the human's. Entries 1 and 2 (the header's two sentences, comment lines only, each kept at its line count) go to a worker; 3 and 4 to the PR body; 5, the form's Amendment 3, to main; the first-failure order goes to a follow-up, by its recommendation. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 7b2079cb5f7d207673d7ebc98aae820fe3414d4cc881a3169ec4d88b1e14cc44.*

---

Reconciled: PR #247 gate 1 words at 7a23dbad24d3efc923e5108a9047811a2909aacf (cut/verify-cites-pin-resolution-and-line-zero @ 7a23dbad24d3efc923e5108a9047811a2909aacf)

Verdict: none. This is a reconciliation and there is no re-gate (AUTONOMY §31; `state/directives/2026-10-11-direction-after-status-review.md`, item 2). None of these words is the human's. The three line-0 reason strings (§2.1) stay as they are. No entry changes code, a test, or a string a test asserts. I grepped `scripts/` at the head: no test reads the header text. Every new line is a `//` comment line, and none carries a `path:digits` token.

Where I give line numbers, they are lines at the head 7a23dbad, written in words, so that this report puts no branch-only cite onto main. I read B's header from the main checkout. Its `scripts/plan/verify-cites.mjs` matches B: `extractCitations` is at line 142 and `checkPinned(cite, repoRoot)` has two parameters. The reviewer confirmed that main changed neither file.

**§7 baseline.** Against B the header now contributes two hunks:
- B lines 14-16 (3 lines) replaced by head lines 14-19 (6 lines): 9 lines.
- B lines 61-63 (3 lines) replaced by head lines 64-67 (4 lines): 7 lines.

So the header is 16 of the file's 60, and the code is 44. Entries 1 and 2 keep each hunk at the same line count with no line equal to a B line, so the file stays at 60.

---

## 1. The header's line-0 sentence (architect D1, reviewer C-2; merged)

**Target:** `scripts/plan/verify-cites.mjs`, head lines 14-19, byte-copied:
~~~
// unresolved, 0 if all resolve. A cite starting or ending at line 0 fails with a reason naming line 0
// (lines count from 1). PINNED FALLBACK: a cite that does not resolve in the tree but is directly
// followed by `@ <commit>` (7-40 hex digits) is read at that commit instead: the commit must exist, a
// path must be a file there, and the line must be within it. The paths tried, in order, are the files the
// tree resolves the path to (the exact set if any, else the suffix set), then the path as written; the
// cite passes at the first holding the line.
~~~

Final words:
~~~
// unresolved, 0 if all resolve. A cite starting or ending at line 0 never resolves; where its reason
// would say a line exceeds a file, it names line 0 instead (lines count from 1). PINNED FALLBACK: a cite
// that does not resolve in the tree but is directly followed by `@ <commit>` (7-40 hex digits) is read
// at that commit instead: the commit must exist, a path must be a file there, and the line must be
// within it. The paths tried, in order, are the files the tree resolves the path to (the exact set if
// any, else the suffix set), then the path as written; the cite passes at the first holding the line.
~~~

**Why merged.**
- Both reports open with "never resolves"; that is kept.
- The condition is taken from the architect's D1, which keys the claim to the reasons the code replaces. I worded it as the reason that "would say a line exceeds a file".
- The reviewer's parenthetical list ("a file found at a pin") is dropped. A pinned cite whose first path is a directory at the pin keeps the directory reason even if a later path is a file holding line 0 (`failure ??=`, head line 289 before 294). So that list would overclaim.
- The PINNED FALLBACK text after the new sentence is unchanged; only the wrap moved. Widths are 101, 105, 103, 99, 102 and 102, all within the file's own 106.

**Clause check at the head:**
- "never resolves":
  - Tree: `checkCitation`'s `inRange` requires `validStart` (head lines 256-257).
  - Pin: in `checkPinned` the line-0 branch (head lines 293-294) comes before the only `return { ok: true }` (head line 297).
- "where its reason would say a line exceeds a file, it names line 0 instead": the code builds the "exceeds" reason in three places (head lines 262, 268, 296). Each is preceded by a line-0 branch (head lines 260, 266, 293-294).
  - If every path is missing at the pin, the tree's line-0 reason is kept (head line 368).
- What the sentence makes no claim about, because these reasons were never "exceeds" reasons:
  - a rooted cite with no match (head lines 253, 374; reviewer P3);
  - a commit that is not found (head line 281; reviewer P4);
  - a directory at the pin (head line 289);
  - a loose cite with no match, which is skipped (head lines 363, 370-374).

**Who:** the worker, comment lines only, byte for byte as given.

**§7:** the hunk is still B's 3 lines removed and 6 added, 9 in all. Net change against the current head: 0.

## 2. The header's pin-limit sentence (architect C1, reviewer C-1; merged)

**Target:** `scripts/plan/verify-cites.mjs`, head lines 64-67, byte-copied:
~~~
// hex word right after `@` is read as a pin; a pin is read at the files the tree resolves the path to,
// then at the path as written, so a relative, `.md`-fallback or basename cite to a file no longer in the
// tree is read at the path as written only, and a loose cite matching nothing is not read at its pin.
// Node's standard library only.
~~~

Final words:
~~~
// hex word right after `@` is read as a pin; a pin is read only at the files the tree now resolves the
// path to, then at the path as written (the pin's own file list is never searched), so a file gone from
// the tree is read only if it is the path as written, and the cite can pass at another file the tree
// now matches; a loose cite matching nothing is not read at its pin. Node's standard library only.
~~~

**Why merged.**
- The structure is the architect's C1: "read only at ... then at the path as written", and "read only if it is the path as written". It is true and short.
- Two clauses come from the reviewer's C-1:
  - "never searched": this is why the file the author meant is never found.
  - "can pass at another file": the reviewer's P1 and P2 show this pass, and C1 left it implicit.
- The reviewer's "at any other file the tree now matches" is not used. When the exact set is not empty, the suffix set is not read (head line 365), so "any" would overclaim.
- The reviewer's full sentence needs 5 to 6 lines, which would take the file to 61 or 62. These words fit the current 4 lines.
- True of P1: `pool.rs` is read at the pin at `renderer/pool.rs`, then at `pool.rs`. `engine/src/pool.rs` is never read, and the cite passes at `renderer/pool.rs`.
- True of P2: the same holds with `renderer/v/src/App.tsx`.

**Clause check at the head:**
- "read only at the files the tree now resolves the path to, then at the path as written":
  - `runVerifyCites` builds the index from `buildTrackedIndex` (`git ls-files`, head line 333).
  - The list is `rr.exact`, else `rr.all`, then `cite.pathRaw` with `./` removed, deduplicated in order (head lines 364-365).
  - `checkPinned` reads only `paths` (head lines 284-290).
- "the pin's own file list is never searched": `checkPinned` runs only `cat-file -e`, `cat-file blob` and `cat-file -t` on `<pin>:<listed path>` (head lines 281, 286, 288). The file has no tree listing at a commit.
- "a file gone from the tree is read only if it is the path as written": every candidate comes from the current index, so the only other entry in the list is the path as written. Test `a_pinned_cite_still_passes_at_the_path_as_written_when_the_tree_resolves_elsewhere` (T-D4d) shows a deleted root file still being read.
- "the cite can pass at another file the tree now matches":
  - `resolveRef` adds suffix matches to `all` (head lines 203-211), and the list uses them when `exact` is empty.
  - `checkPinned` returns ok at the first path that holds the line (head line 297), and `runVerifyCites` then moves on (head line 366).
  - The reviewer's P1 and P2 show the pass.
- "a loose cite matching nothing is not read at its pin": the condition at head line 363.
- "Node's standard library only.": the imports at head lines 78-81 are unchanged.

**Who:** the worker, comment lines only, byte for byte. The worker makes entries 1 and 2 in one commit.

**§7:** the hunk is still B's 3 lines removed and 4 added, 7 in all. Net change: 0. The file stays at 60, at its ceiling and not over.
- The worker confirms this with `git diff --numstat e408606d...HEAD`.
- If git aligns the hunks differently and the figure goes past 60, that is class 8 (`budget overrun, §7 not edited`), recorded in the closing amendment with the figure and the commit. §7 is not edited.

## 3. The PR body's Summary (architect D2, with the reviewer's C-1 point carried into it)

**Target:** the PR body, Summary, its first paragraph, byte-copied:
~~~
`verify-cites.mjs` gives a cite whose start or end is line 0 a reason naming line 0, in the tree's exact and suffix tiers and at a pin, in place of a reason naming its highest line as exceeding the file. A pinned cite that fails in the tree is now read at its pin at each file the tree resolves its path to (the exact set if any, else the suffix set), then at the path as written, and passes if any of them holds the cited lines there; before, a pin was read only at the path as written. Statuses, tiers, the CLI and the exit codes are unchanged, and no export that `verify-quotes.mjs` imports changes.
~~~

Final words:
~~~
`verify-cites.mjs` gives a cite whose start or end is line 0 a reason naming line 0, in the tree's exact and suffix tiers and at a pin, in place of a reason naming its highest line as exceeding the file. A pinned cite that fails in the tree is now read at its pin at each file the tree resolves its path to (the exact set if any, else the suffix set), then at the path as written, and passes if any of them holds the cited lines there; before, a pin was read only at the path as written. A loose pinned cite that matches nothing in the tree is still not read at its pin, and a pinned cite whose file is gone from the tree can now pass at another file the tree matches. Statuses, tiers, the CLI and the exit codes are unchanged, and no export that `verify-quotes.mjs` imports changes.
~~~

**Why this form.** It carries D2's exception as its own sentence. The architect's place for it, inside the "then at the path as written" clause, breaks that clause in two. It also adds C-1's pass, so that the body says what the header now says.

**Clause check:**
- The added first clause: head line 363.
- The added second clause: entry 2's clause check. "now" holds because P1 and P2 are advisory under main's checker at 2ffbf957, whose file equals B's (reviewer, What I checked, item 3), and pass at the head.

**Who:** the custodian.

**§7:** none.

## 4. The PR body's Gates line (architect D3, reviewer D-1; merged)

**Target:** the PR body, Gates, byte-copied:
~~~
Architect and reviewer, both full (§9). The line-0 reasons and the header's sentences are the architect's wording (§2.1), not the human's. By the human's ruling, item 1, this PR and its gates run alongside #245. **Merge with a merge commit.**
~~~

Final words (the custodian replaces `<worker commit>` with the worker's full commit id; nothing else changes):
~~~
Architect and reviewer, both full (§9). The line-0 reasons are the architect's wording (§2.1). The header's pin-limit sentence was drafted by the architect (§2.3, second bullet) and its line-0 sentence by the worker (§2.3, third bullet); gate 1 failed both on wording only, and the architect's reconciliation of the two gates' words, `state/consults/2026-10-23-verify-cites-pin-resolution-and-line-zero-gate1-words-reconciled-architect.md`, is applied under AUTONOMY §31 with no re-gate: entries 1 and 2, the header's line-0 and pin-limit sentences in `scripts/plan/verify-cites.mjs`, at <worker commit>; entries 3 and 4, this body's Summary and this paragraph; entry 5, the form's Amendment 3, on main. None of these words is the human's. By the human's ruling, item 1, this PR and its gates run alongside #245. **Merge with a merge commit.**
~~~

**Why merged.**
- D3's correction to "§2.1 and §2.3" is made precise by D-1's split: §2.1 holds the strings, and §2.3 holds the sentences.
- D3's list of the applied words is the list §31 requires.
- D-1's "worded by the worker" is narrowed to the line-0 sentence. §2.3's second bullet drafts the pin-limit sentence, which the reviewer's own D-1 notes.

**Clause check:**
- Form §2.1: the three strings, in its "After" list.
- Form §2.3: the second bullet words the D4 limit, and the third bullet only directs that the line-0 reason be named.
- Both gate reports: Verdict FAIL, Evidence none.

**Who:** the custodian.

**Housekeeping in the same edit (not a finding):**
- Update **H** in the Summary's B/H bullet to the worker's commit.
- Add that commit to Commits.
- Re-read Scope's 60/106/166 from numstat at that commit.

**§7:** none.

## 5. The form's next amendment (reviewer C-3; architect C1's last bullet)

**Target:** the form's next amendment, Amendment 3, appended at the end of `scripts/plan/VERIFY-CITES-PIN-RESOLUTION-AND-LINE-ZERO-PREREGISTRATION.md` on main.
- Order: the custodian files this report at the REPORT PATH first.
- No line cites in the amendment. It names the branch commit in words with no hash (round 15 (e)).

Final words (the custodian replaces both `<worker commit>` with the worker's full commit id):
~~~
## §10 Amendment 3 — gate 1: two claims superseded by the header's corrected sentences (class 1); written after the gate results were seen

*Written by the custodian on main after gate 1's results were seen. References only: the gate 1 reports `state/consults/gates/2026-10-23-verify-cites-pin-resolution-and-line-zero-gate1-architect.md` (C1, D1) and `state/consults/gates/2026-10-23-verify-cites-pin-resolution-and-line-zero-gate1-reviewer.md` (C-1, C-2, C-3, probes P1 to P4); the reconciled words `state/consults/2026-10-23-verify-cites-pin-resolution-and-line-zero-gate1-words-reconciled-architect.md`, entries 1 and 2; the worker's commit <worker commit> on `cut/verify-cites-pin-resolution-and-line-zero`.*

1. **§1's first may-not-claim bullet, its second sentence, and §2.3's second bullet** are untrue: a cite whose file is gone from the tree can pass at its pin at another file the tree now matches (the reviewer's P1 and P2). They are superseded by the reconciled words' entry 2, which the header carries from <worker commit>.
2. **§1's first may-claim** is read with §2.1's conditions: a line-0 cite with no match, or pinned at a commit not found, keeps that reason, and a loose one with no match is skipped (the reviewer's P3 and P4); the reconciled words' entry 1 is the header's statement of it.
3. **Superseded index:** §1, may not claim, bullet 1, sentence 2 → item 1; §2.3, bullet 2 → item 1; §1, may claim 1 → read with item 2, not replaced.

Nothing above is edited.
~~~

**Class.** This is class 1, under round 15, item (g). The gate's findings are the round's results, and this amendment records what they invalidate. It is not class 3, which never changes a claim except in test text.

**Item 2 is mine, not either gate's.**
- §1's first may-claim ("fails with a reason that names line 0 ... and the pin path") is as broad as the header sentence C-2 corrects. The reviewer's P4 contradicts "the pin path", and a loose line-0 cite with no match does not fail.
- Leaving it would keep the record broader than the corrected header.
- It is read with the code's conditions, not replaced, so it states no new claim.

**Each item is within round 12 (d)'s three-sentence ceiling, and item 3 is round 12 (e)'s superseded index.**

**Clause check:**
- Item 1: entry 2's clause check.
- Item 2:
  - `checkCitation` returns no-match before any line test (head line 253);
  - `checkPinned` returns commit not found (head line 281);
  - the loose no-match skip (head line 363).
- Neither gate found an Evidence failure, and §7 is untouched.

**Who:** the custodian, on main, after entries 1 to 4.

**§7:** none. The form is exempt (§7, §21c).

---

## Also settled

**The first-failure order (the reviewer's non-blocking note; X1 survives).** Recommendation: a follow-up PLAN node, not a test in this PR.
- §1 claims nothing about the order. The `checkPinned` JSDoc's "else the first failure that is not a missing file" is true by the reviewer's P5. So no claim here is false, and there is a test gap, nothing more.
- A test here would be a class 9 scope addition. It needs an amendment declaring its §2, §4 (with a mutation), §5 and §8 items before any code, then a further commit and a gate of that addition, all for a property the piece does not claim.
- The custodian may fold the test into the form of the proposed node `verify-cites-out-of-range-line-count` when it is drafted. That node changes the same reasons in the same function. The node's id and placement are the custodian's to propose.

**Code, tests and asserted strings.** No entry changes code, a test, or a string a test asserts.
- Entries 1 and 2 are `//` comment lines in the header.
- Entries 3 and 4 are the untracked PR body.
- Entry 5 is a form amendment.

**Order:**
1. The worker's one commit: entries 1 and 2, byte for byte, then `git diff --numstat e408606d...HEAD` to confirm 60.
2. The custodian's PR body edit: entries 3 and 4, plus the housekeeping.
3. The custodian on main, after this report is filed: entry 5.

## Could not settle

- **The figure after the worker's commit.** I have no shell. "Stays at 60" rests on these line counts, and on git matching B lines 14-16 and 61-63 against the new lines with no shared line, as it does at the head. The worker's numstat is the proof. Over 60 is class 8, as entry 2 says.
- **P1 to P5.** I did not run them. I read them from the reviewer's report and checked each against the code at the head by reading only.
- **The worker's commit id.** It does not exist yet, so entries 4 and 5 carry `<worker commit>` for the custodian to fill.

Files: `C:/dev/wt/vcpin/scripts/plan/verify-cites.mjs`, `C:/dev/spatial-ide/scripts/plan/verify-cites.mjs` (B's header, read from main), `C:/dev/spatial-ide/scripts/plan/VERIFY-CITES-PIN-RESOLUTION-AND-LINE-ZERO-PREREGISTRATION.md`, `C:/dev/spatial-ide/state/consults/gates/2026-10-23-verify-cites-pin-resolution-and-line-zero-gate1-architect.md`, `C:/dev/spatial-ide/state/consults/gates/2026-10-23-verify-cites-pin-resolution-and-line-zero-gate1-reviewer.md`, `C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md` (the class definitions).
