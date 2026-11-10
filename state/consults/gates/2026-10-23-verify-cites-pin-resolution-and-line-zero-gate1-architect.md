Reviewed: PR #247 at 7a23dbad24d3efc923e5108a9047811a2909aacf, gate 1, architect (cut/verify-cites-pin-resolution-and-line-zero @ 7a23dbad24d3efc923e5108a9047811a2909aacf)
Verdict: FAIL

The code is correct and the evidence holds. This FAIL rests on the words of one header sentence and nothing else. That sentence is not the human's wording: the architect drafted it, in the drafting consult's §2.3. Under the wording-block rule (AUTONOMY §31; `state/directives/2026-10-11-direction-after-status-review.md`, item 2), the worker applies the replacement words below with no re-gate, and the PR body lists them.

## Correctness

**C1. The header's D4 limit claims a reading the code does not do (§8 item 7).**
- Where: `scripts/plan/verify-cites.mjs:64-66` at the head. The clause runs from "a pin is read at the files" to "not read at its pin."
- What is wrong (paraphrase): the clause says a relative, `.md`-fallback or basename cite to a file no longer in the tree is read at the path as written only. The code does that only for a rooted cite whose tree lookup finds nothing (:363, which leaves the list as `[path as written]`).
  - A basename cite has no `/`, so it is always loose (classifyPath, :225-230). If the tree has a same-basename sibling, the pin is read at that sibling and then at the path as written (:364-365). If the tree has nothing, the pin is not read at all (:363).
  - So for a basename cite, "read at the path as written only" is never true. The same holds for a relative cite that is not rooted (for example `src/App.tsx`).
  - The sentence contradicts its own last clause, and it states the checker as stricter than it is: a sibling can pass the cite.
- Fix: replace lines 64-66 with exactly these three lines. Line 67 stays as it is.
```
// hex word right after `@` is read as a pin; a pin is read only at the files the tree now resolves the
// path to, then at the path as written, so a file the tree no longer resolves the path to is read at
// its pin only if it is the path as written, and a loose cite matching nothing is not read at its pin.
```
- Clause check:
  - "read only at the files the tree now resolves the path to, then at the path as written": :333 builds the index from the current tree's `git ls-files`. :364-365 build the list: the exact set if any, else `all`, then pathRaw without `./`, deduplicated by a Set in first-seen order. checkPinned reads only `paths` (:284-286). True.
  - "a file the tree no longer resolves the path to is read at its pin only if it is the path as written": follows from the list. T-D4d shows it: the root `scripts/x.mjs` is deleted from the tree and is still read, because it is the path as written (test :416-429). True.
  - "a loose cite matching nothing is not read at its pin": :363. True.
- The same clause appears in the form's §2.3, and in its §1 May-not-claim first bullet. The form is append-only, so it is not edited; the PR body's list of applied words says that these words replace §2.3's clause.

## Evidence
None.

## Documentation (must fix before the merge; no re-gate)

**D1. The line-0 sentence in the header overstates what is reported.**
- Where: `scripts/plan/verify-cites.mjs:14-15`.
- What is wrong: the sentence says every line-0 cite fails with a reason naming line 0. Two cases do not:
  - a rooted cite with no match fails with the no-match reason (:253, :374);
  - a loose cite with no match is skipped (:363, :370-374).
- Fix: replace the sentence with: "A cite starting or ending at line 0 never resolves; where a file's line count would be its reason, in the tree or at its pin, the reason names line 0 instead (lines count from 1)." Reflow the comment.
- Clause check:
  - "never resolves": :256-257 (validStart gates inRange) and :293-297 (the zero branch comes before the only `ok` return).
  - "names line 0 instead": :260 comes before :262 (exact tier), :266 before :268 (suffix tier), :293-294 before :295-296 (pin).
  - When every path is missing at the pin, the tree's line-0 reason is kept (:368).
  - A no-match cite has no line-count reason, so the sentence makes no claim about it.
- Not the human's wording.

**D2. PR body, Summary.**
- What is wrong: the Summary says a pinned cite that fails in the tree is read at its candidates, then at the path as written. It leaves out the unchanged exception at :363.
- Fix: after "then at the path as written", add: ", except a loose cite that matches nothing in the tree, which is still not read at its pin".
- Clause check: :363.

**D3. PR body, Gates.**
- What is wrong: the Gates line cites "(§2.1)" for the header's sentences, which are §2.3.
- Fix: write "(§2.1 and §2.3)", and list C1's and D1's words as applied under §31.

## §8, item by item
1. Holds. verify-quotes imports buildTrackedIndex, extractCitations, resolveRef, classifyPath, topDirsOf and CODE_EXTS (`scripts/plan/verify-quotes.mjs:137`). Each is byte-identical between B and the head: B :142-209 against head :146-213, offset +4, and the constants. verify-quotes.mjs is not in the 2-file diff.
2. Holds. The exports are the same set as at B. checkPinned's `paths` is required and has no default; its one caller is runVerifyCites (:365). The only other importer, `scripts/plan/rotate-decisions-pending.test.mjs:20`, imports only runVerifyCites.
3. Holds.
   - By code: the path as written is always in the list. A failing earlier path only sets `failure` (`??=`) and never returns, so any pass at B still passes. The tier inputs (status, cls, archived, sink) are unchanged.
   - By corpus: I1 and I2 show gated 0 against 0, no row added and none leaving.
4. Holds. The new test comments carry no colon-digit token. The line-0 cites are built at run time (AT0, test :341, in a code line). In I2, gated is 0 over the head's tree, which includes the form.
5. Holds. The comments say "applied alone and reverted" at eb499a8910b8. The worker's report says no verify-mutation tool was used, and the custodian's filing note confirms this from the transcript.
6. Holds, as far as I can read it. The diff touches 2 files. My line-by-line estimate of the code file comes to about 60, consistent with the reported 37+23=60, which is exactly the ceiling. I could not run numstat; the reviewer recomputes it.
7. Fails, at :64-66 (C1). Lines 15-19 (PINNED FALLBACK) match the code. D1 is a documentation overstatement, not a claimed resolution or limit.

## What I checked
- **§2.1, the three line-0 reasons, read against code at the head:**
  - exact tier :260; suffix tier :266, with `which` formed as at B; pin :293-294;
  - the order commit (:281), file (:286-290), line 0 (:293), range (:295);
  - a rooted cite with no match keeps its no-match reason (:253, :374).
- **§2.2:**
  - the list is exact, else all, then the path as written with `./` stripped, ordered and deduplicated (:365);
  - the commit is checked once (:281), and the first file holding the line returns ok (:297);
  - otherwise the first failure in list order that is not a missing file wins: a directory, line 0 or a range (`??=`, :289, :294, :296);
  - if every path is missing, the result is missingFile naming the path as written (:299);
  - a list holding only the path as written gives B's results apart from C3's line-0 wording (compared with B :269-287).
- **§2.3:** header :14-19 and :59-66, read against the code (C1, D1).
- **§1:**
  - claims 1 to 3 hold in code;
  - the Unchanged list: resolveRef, classifyPath, topDirsOf, buildTrackedIndex, extractCitations and the pin regex are byte-identical; the ledger rule, routing and pin condition at :356-379 match B's :343-365 except :364-365; the reason strings for a non-zero line, a missing commit and a missing file are unchanged;
  - the checkHashRef agreement (`scripts/plan/verify-quotes.mjs:779-800`) holds for one candidate and for none, for every cite verify-cites reads at a pin. The loose no-match skip is §1's own May-not-claim second bullet and is not new.
- **§4 against the tests at the head:**
  - T-C3a :344-355; T-C3b :359-363; T-D4a :382-396; T-D4b :400-403; T-D4c :407-411; T-D4d :416-429;
  - the C2 test :326-338 has the `late.rs` fixture, added in a commit after the pin, so every path is missing at the pin, and its assertion matches §4;
  - each setup and assertion matches §4. I traced each mutation's effect by hand, and each agrees with its recorded comment;
  - B's old C2 fixture survives unchanged as T-D4c (:408 is the same as B :324). Existing tests before :322 are unchanged, since line numbers agree up to :321 and only two lines are removed.
- **Amendment 2:** both observations follow from the code.
  - M-D4b: T-D4c's basename cite has no exact candidate, so the list becomes `[pool.rs]`, which is missing at the pin, and the tree's reason is kept.
  - M-D4d: `engine/src` resolves to nothing (resolveRef :189-213), so the list is empty, the result is missingFile, and the no-match path's not-found reason fails P5's regex.
  - No §5 invalidator is met. Class 2 fits.
- **I1 and I2 against §3:**
  - each run's single change is C3, at the gate report's line-54 cite, reason only, now the exact-tier wording;
  - gated is 0 in every run; nothing is added and nothing leaves; the I1-at-B control shows 0 differences.
  - Instrument limit, which does not change this reading: rows are keyed by (relPath, citeLine, target) in a Map, so rows with the same key collapse. Code limits reason changes to line-0 and pinned cites.
  - E0 was taken over fb98f44b (108 advisory), while I1 ran over 2ffbf957 (110). No D4 change occurred on either tree, so the class bound is not tested by those two extra entries.
- **Round 25 item 2:** no §7 overrun, no class-9 scope addition, no verify-mutation run called an observation, no hash pin at a branch commit, full form.
- **Not run (no shell):**
  - the suites, verify-cites, verify-quotes, verify-test-claims and verify:plan;
  - numstat and the record hashes;
  - whether eb499a89 to 7a23dbad changes only comment lines of the test file, which is what makes §4's "re-observed at the head" true of the C2 mutation. The reviewer confirms this.

Files: `C:/dev/wt/vcpin/scripts/plan/verify-cites.mjs`, `C:/dev/wt/vcpin/scripts/plan/verify-cites.test.mjs`, `C:/dev/spatial-ide/scripts/plan/VERIFY-CITES-PIN-RESOLUTION-AND-LINE-ZERO-PREREGISTRATION.md`, `C:/dev/spatial-ide/state/drafts/verify-cites-pin-i1-i2/`.
