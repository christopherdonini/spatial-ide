*Custodian's filing note (2026-11-08): the architect's five-line form draft for slot 2's `stale-harness-comments-find-prime-and-late-result`, read only at main 05824408. Its brief was given by file (8568 bytes, sha256 cbea5658b6f408d37db923eab7bd6bb5edc1c97c6c181c2ad4bed66a4f523987), with the in-flight paths by git and the reuse index's output byte for byte. Dispatched at 2026-11-08T13:23:07.853Z by its transcript; the run went to 2026-11-08T13:32:48.748Z (claude-opus-5-5; unique calls: Read 38, Grep 32, Glob 2, the hand-back, 73 in all). The report below was extracted by script from the hand-back in that transcript (26153 bytes, sha256 ab0069f6c75eb25fd81b0a72ba7aeed745db5f456028919f9894db764d298674) and is unchanged. The custodian checked by script, at 05824408: its three code blocks copied from the two Scope files (regression.mjs :1946-1950 and :2260-2265; App.lateResult.test.tsx :1349), each equal to the lines it names (its other three blocks are its proposed words, in its words); its reuse block, equal to the brief's; and its quotations, each found in the tree except its own proposed words, the reuse searches, and two that cross a line break in the source (the test comment's clause on the callback, at :1345-1350, and the header's reinstatement clause, at :1949-1950), each found in the named lines joined. Its `sha256:<hex>` placeholders are computed by script before the form is filed. OPEN-1 (A), a single reviewer under §21b, and OPEN-4 (A) take its recommendations under item 4 of 2026-10-31; OPEN-2 (a) is taken on the custodian's reading that the :1930 form path is a cite inside the header the node names, a reading the human may overrule as an addition. OPEN-3, six sibling stale lines in the same two files, is a red line by its reading (a scope change to a ruled item) and goes to the human: (a) widen the node to them, or (b) exclude them and propose a new node. A draft, not Authority: the form is committed separately, after #299 merges and before any code (`governance/forms/frontends/STALE-HARNESS-COMMENTS-FIND-PRIME-AND-LATE-RESULT-PREREGISTRATION.md`).*

---

Draft: stale-harness-comments-find-prime-and-late-result, five-line form, architect. main @ 058244086f9914525ea8e4761c7baa07ea4f6e62. There is no verdict, because this is a draft.

I read the working tree. The session's git status names HEAD 05824408. I have no shell, so I could not confirm HEAD myself, and I can give no sha256 for any pin. Wherever a pin below shows `sha256:<hex>`, the hash is computed by script before the form is filed. I leave no background shell.

---

## The five lines (mine)

```
Authority: PLAN node `stale-harness-comments-find-prime-and-late-result` (governance/PLAN.yaml:6702-6718 @ 058244086f9914525ea8e4761c7baa07ea4f6e62), generation 1, S3, budget 30 minutes, depends_on publish-filter-sentence-e2e-shown-case (#299), so no code starts before #299 merges; placed by the human in slot 2, third (state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md:20 @ 058244086f9914525ea8e4761c7baa07ea4f6e62); the triage, a reading and not Authority (state/consults/2026-11-05-area-e-kl-triage-numbered-items-architect.md, section 6, platform findings 2, 3 and 5); the human's rulings on gate rounds, Part 1, items 1 to 9, by reference (state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md:28-64 @ 058244086f9914525ea8e4761c7baa07ea4f6e62); OPEN items that are not red lines are taken under the direction of 2026-10-31, item 4 (state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md), held until 2026-11-09; gating per OPEN-1; the reuse index found no prior art on either search (stale test comments harness; e2e step header status comment), a miss noted here.
Scope: 2 files, comment lines only: frontends/shell/e2e/regression.mjs (the entry-84 paragraph of the FIND' header, from "**SUSPENDED" at :1946 to :1950; the status comment above the status assertion, :2260-2265 of the block at :2256-2265; under OPEN-2 (a), :1930's form path); frontends/shell/src/App.lateResult.test.tsx (the cite at :1349); line numbers at 058244086f9914525ea8e4761c7baa07ea4f6e62; declared line budget 60, insertions plus deletions by §21c's counting, this form exempt; no other file; not the lines OPEN-3 lists unless the human rules them in; no assertion, no `failures.push`, no test name, no string literal and no code token.
Change: the FIND' header no longer says its entry-84 assertion is suspended, names a silently dropped tile query, or says the assertion reinstates itself, and instead states which readings `stepFind`'s step 4 fails on; the status comment no longer calls a red expected while the engine half is unbuilt, and instead names the admission lease class and its declared ceiling, pinned; App.lateResult.test.tsx's cite into candidateArmSession.ts is repointed to the manager callback and `endCandidateSession`, pinned.
Tests+mutation: none added or changed, so no mutation; a verify-mutation run is not an observation. Comment-only is shown at the head against base B by: a token-stream comparison of both files (TypeScript's scanner, trivia skipped), equal; every changed diff line a `//` line; `node --check e2e/regression.mjs` exit 0; in frontends/shell, `npm run typecheck`, `npx vitest run src/App.lateResult.test.tsx` and the full `npm run verify`, each exit 0, inside `hold shared -Project SpatialIDE`. No e2e run (note 4). Each pin's hash is recomputed by script. Each changed comment is checked clause by clause against the code at the head (Part 1, item 1).
Out-of-scope: ADR: none (no file under docs/; ADR-033 is cited by number, unchanged); security: none (no exposure surface, no dependency, no hook or label touched); wire: none (nothing under protocol/); guarantee: none (no property changes: every token of the FIND' assertion and of the test file is unchanged, and the comments state what that code does at the head); no string the app shows.
```

---

## Notes (mine)

**1. Each stale comment at main (settle 1).** I copied the blocks from the Read tool's output, not by script. The custodian copies them by script, or pins them, before filing.

**1a. The FIND' header, entry-84 paragraph.** At frontends/shell/e2e/regression.mjs:1940-1950 @ 058244086f9914525ea8e4761c7baa07ea4f6e62, the stale span is :1946-1950:
```
//     nothing was missing. **SUSPENDED, and recorded by name rather than failed** (preregistration
//     §6 Amendment 1 (b), 2026-09-13): a second cause -- filtered per-tile queries dropped silently
//     before any stream is issued, DECISIONS-PENDING entry 87 -- leaves covering tiles that reach no
//     terminal at all, and while any exist this assertion cannot discriminate entry 84's fix. It
//     reinstates itself, unchanged, on the first run where none exist.
```
What makes each clause untrue at main:
- **"SUSPENDED, and recorded by name rather than failed".** Step 4 pushes a failure on all three of its non-pass branches (regression.mjs:2266-2287 @ 058244086f9914525ea8e4761c7baa07ea4f6e62), and the step throws them together (:2331-2333). The file holds no `records.push`; the only hit, at :2259, is inside a comment.
- **"filtered per-tile queries dropped silently before any stream is issued".**
  - Every mint refusal is logged (frontends/shell/src/streaming/tileViewportStreamManager.ts:951 @ 058244086f9914525ea8e4761c7baa07ea4f6e62, `logMintRefused(tileKey, err);`).
  - An `engine.connections_exhausted` refusal is retried once (:982-994).
  - Predicate admission leases its own class (engine/src/predicate.rs:145-147 @ 058244086f9914525ea8e4761c7baa07ea4f6e62), sized 4 (engine/src/pool.rs:132 @ 058244086f9914525ea8e4761c7baa07ea4f6e62), which is declared as 3 tile streams plus 1 baseline query (pool.rs:111-115; frontends/shell/src/canvas/tileGridConstants.ts:40 @ 058244086f9914525ea8e4761c7baa07ea4f6e62).
- **"It reinstates itself … where none exist".** No branch reads `unminted`. It is assigned at :2255 and read only at :2319-2322, inside `observed`.
- **What stays.** :1940-1946 up to "nothing was missing." stays. The retained "before the fix" history is not this node's.

**The architect's words** (mine; they replace :1946-1950, 5 lines out, 4 in):
```
//     nothing was missing. `stepFind`'s step 4 pushes a named failure when the covering set was
//     truncated, when the status settled to the settled-partial sentence, and when it never
//     settled to the within-budget one. No branch reads the unminted-tile counts, which only the
//     step's observed summary reports, and the step throws every collected failure at its end.
```
Clause check:
- (a) "step 4": the `// 4)` comment at regression.mjs:2246.
- (b) "a named failure when the covering set was truncated": :2266-2272.
- (c) "when the status settled to the settled-partial sentence": :2273-2280.
- (d) "when it never settled to the within-budget one": :2281-2286, which fails on `null` or no match of `FIND_WITHIN_BUDGET_PATTERN`.
- (e) "No branch reads the unminted-tile counts": `unminted` appears only at :2255, :2265 (a comment) and :2319-2322.
- (f) "which only the step's observed summary reports": :2319-2327.
- (g) "throws every collected failure at its end": :2331-2333.
- The words add no cite, so there is nothing to pin.
- The header's lead sentence, "this step names each of them in its own failure" (:1937-1938), stays true. That is the D1 check from #299's gate.

**1b. The status comment.** It is regression.mjs:2256-2265 @ 058244086f9914525ea8e4761c7baa07ea4f6e62. The stale span is :2260-2265:
```
  // anywhere in this function that reads `unminted` and chooses not to fail. This step FAILS on
  // this build whenever the covering set was not truncated and the status still reads
  // settled-partial (or never reaches within-budget) -- expected and honest while the engine half
  // (entry 91 (a), ADR-033) is not built: the shell-side bounded requeue (§2.3(iii)) only
  // mitigates the lease contention, it does not resolve it. `unminted` itself is read ONLY in the
  // `observed` summary below (informational), never in a branch condition here.
```
What makes each clause untrue at main:
- **"expected and honest while the engine half (entry 91 (a), ADR-033) is not built".** It is built:
  - predicate.rs:131 names "entry 91 (a); ADR-033";
  - :145-147 `.acquire(LeaseClass::Admission)`;
  - pool.rs:224 is the `Admission` variant, :240 its capacity and :132 `MAX_ADMISSION_CONNECTIONS: usize = 4`.
  - The PLAN node `polish-engine-lease-class` is done (governance/PLAN.yaml:362-378 @ 058244086f9914525ea8e4761c7baa07ea4f6e62), as is `polish-87-88-89` (:344-360).
- **"only mitigates the lease contention, it does not resolve it".** This is a cause claim the code no longer supports. Admission no longer shares Maintenance's single lease (pool.rs:125-131).
- **What stays.** :2256-2259, and :2260 up to "chooses not to fail.", stay true: there is no `records.push` and no branch on `unminted`.

**The architect's words** (mine; they replace :2260-2265, 6 lines out, 11 in; each pin is written whole on one line, per round 15 (d)):
```
  // anywhere in this function that reads `unminted` and chooses not to fail. This step FAILS
  // whenever the covering set was not truncated and the status still reads settled-partial (or
  // never reaches within-budget). Predicate admission leases its own engine class,
  // `LeaseClass::Admission` (entry 91 (a), ADR-033), at
  // engine/src/predicate.rs:145-147 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:<hex>; its
  // ceiling, `MAX_ADMISSION_CONNECTIONS = 4`, at
  // engine/src/pool.rs:132 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:<hex>, is declared as
  // the shell's three in-flight tile streams plus one baseline (non-tiled) viewport query, at
  // engine/src/pool.rs:111-115 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:<hex>.
  // `unminted` itself is read ONLY in the `observed` summary below (informational), never in a
  // branch condition here.
```
Clause check:
- (a) "FAILS whenever … not truncated and … settled-partial (or never reaches within-budget)": :2273-2286 push, and :2331-2333 throw.
- (b) "leases its own engine class, `LeaseClass::Admission`": predicate.rs:145-147, and pool.rs:108-109 ("its own class").
- (c) "(entry 91 (a), ADR-033)": predicate.rs:131.
- (d) "`MAX_ADMISSION_CONNECTIONS = 4`": pool.rs:132.
- (e) "declared as the shell's three in-flight tile streams plus one baseline (non-tiled) viewport query": pool.rs:111-115, and tileGridConstants.ts:40.
- (f) The last sentence is retained, and true per 1a (e).
- The words state no cause of any red and make no claim that FIND' passes.

**1c. App.lateResult.test.tsx.** The comment is at frontends/shell/src/App.lateResult.test.tsx:1345-1350 @ 058244086f9914525ea8e4761c7baa07ea4f6e62. The stale span is :1349:
```
  // (`residency/candidateArmSession.ts:1046, :1076-1082`), NOT by `session.stop()` -- with A's first
```
- **Where it sits.** The comment heads the pair of tests in the "candidate arm" `describe` (:1070). The first is "the human's full ended -> reopen -> old SUCCESS sequence through reportViewportOutcome does not clear B's standing refusal (candidate arm)" (:1357). Its REJECTION twin is at :1367. Both share `runB2CandidateSequence` (:1373-1421), which ends A through `depsA.onSessionEnded` at :1380.
- **What the cited lines hold now.**
  - candidateArmSession.ts:1046 is a comment line inside the tile-terminal callback.
  - :1076-1082 is the middle of `endCandidateSession`'s doc comment.
- **The route the cite means.**
  - :1061, `onSessionEnded: (detail) => endCandidateSession(detail),`, is in the manager's options object, which opens at :922.
  - :1089-1103 is `endCandidateSession`, which calls `deps.onSessionEnded?.(detail);` at :1102.
  - The manager's own call is at tileViewportStreamManager.ts:752, `this.opts.onSessionEnded?.(detail);`, inside `endSession` at :740-753.
- **What stays.** The other clauses at :1345-1350 hold: "fired by `endCandidateSession` via `TileViewportStreamManager.endSession`'s own `onSessionEnded` callback", and "NOT by `session.stop()`" (no stop before :1380).

**The architect's words** (mine; they replace :1349, 1 line out, 3 in):
```
  // (frontends/shell/src/residency/candidateArmSession.ts:1061 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:<hex>, the
  // manager's callback, and frontends/shell/src/residency/candidateArmSession.ts:1089-1103 @ 058244086f9914525ea8e4761c7baa07ea4f6e62 sha256:<hex>,
  // `endCandidateSession`), NOT by `session.stop()` -- with A's first
```
Clause check:
- (a) ":1061, the manager's callback": the `onSessionEnded` option of `new TileViewportStreamManager({` (:922), which the manager calls at tileViewportStreamManager.ts:752.
- (b) ":1089-1103, `endCandidateSession`": the function, with :1102 firing the dep.
- (c) The rest of the line is retained.

**Rules for every pin:**
- The pin is at 058244086f9914525ea8e4761c7baa07ea4f6e62 when `git diff --quiet 058244086f9914525ea8e4761c7baa07ea4f6e62 B -- <the cited file>` exits 0. Otherwise the line is re-derived by content and pinned at B, which is a commit on main.
- The hash covers the whole lines with their LFs (`git show <rev>:<path> | sed -n '<a>,<b>p' | sha256sum`).
- Each pin stays contiguous on one line (round 15 (d)) and is rooted, so `verify-cites` gates it.

**2. The route (settle 2).**
- **Files:** 2. With no OPEN item: 9 + 17 + 4 = 30 lines. With OPEN-2 (a): 32. These are counts of my words, not of a diff. Declared 60.
- **§21c** (governance/AUTONOMY.md:349-357 @ 058244086f9914525ea8e4761c7baa07ea4f6e62): all four bounds hold. Lines and files are under the bound, there is no exposure surface or dependency, and there is no user-visible behaviour.
- **§21a** (AUTONOMY.md:317-332 @ 058244086f9914525ea8e4761c7baa07ea4f6e62): none of the four categories is touched.
  - On "any property currently under test": no property changes. The comments restate code that keeps every token.
  - The precedents split. The stale-test-names form read category 4 as touched (governance/forms/frontends/STALE-TEST-NAMES-AND-COMMENTS-PREREGISTRATION.md:24 @ 058244086f9914525ea8e4761c7baa07ea4f6e62). Area A's form and #299's form read "no property changes" as untouched. See OPEN-1.
- **§21b** (AUTONOMY.md:336-345 @ 058244086f9914525ea8e4761c7baa07ea4f6e62): the single reviewer gate is open.
- **§25 (e)** (AUTONOMY.md:482 @ 058244086f9914525ea8e4761c7baa07ea4f6e62): it does not bite, because the Out-of-scope line asserts none of the four.
- **§36** (AUTONOMY.md:687-696 @ 058244086f9914525ea8e4761c7baa07ea4f6e62): it does not apply. The human placed this node in slot 2, not on the filler queue.
- **The smallest true reading:** a five-line form with 2 files, about 30 lines, and one reviewer. Scope is not trimmed.

**3. What shows nothing else changed (settle 3).** B is the merge-base on main after #299 merges, and H is the head.
1. `git diff --name-only B...H` lists exactly the 2 files. It exits 0.
2. `git diff --numstat B...H`: insertions plus deletions are at most 60.
3. Token equality: a scratch script uses `ts.createScanner` from the shell's `typescript`, with trivia skipped (JSX variant for .tsx, JS for .mjs), over each file at B and at H. Both are equal, and it exits 0. It is self-tested negative first, on one changed identifier in a scratch copy, which exits 1. Equality also proves that no `failures.push` (regression.mjs:2267, :2274, :2282, :2303, :2309), no assertion and no `it(` title changed.
4. A scratch check over `git diff -U0 B...H -- <2 files>` that every `+`/`-` content line matches `^[+-]\s*//`. It exits 0, and is self-tested negative.
5. `node --check frontends/shell/e2e/regression.mjs` exits 0.
6. The shell tests, in the worker's worktree:
   - `npm ci` in frontends/shell and in renderer/bundle-viewer, each from its lockfile;
   - then, in frontends/shell, inside `hold shared -Project SpatialIDE`: `npm run typecheck` (exit 0), `npx vitest run src/App.lateResult.test.tsx` (exit 0) and `npm run verify` (exit 0; the full suite at the reviewed head, Part 1, item 4).
7. Pins: a scratch script recomputes each `sha256:` against `git show <rev>:<path>` and exits 0.
   - `node scripts/plan/verify-cites.mjs` exits 0.
   - The tool as read at 058244086f9914525ea8e4761c7baa07ea4f6e62 (its header, :30-34 and :86-93) scans comments in .mjs and .tsx files and gates rooted cites. It does not check a pin when the cite already resolves in the tree, so it does not prove a pin. Step 7's recompute does that.
8. `verify-quotes`, `verify-test-claims`, `verify.mjs --offline` and `node --test` over the scripts suites each exit 0, named with the commit they ran at.
9. The bytes of the added lines hold no CR.

**The gate re-checks** steps 1 to 5 and 7, and checks each changed clause against H.

**4. No e2e run is needed.**
- regression.mjs is run by an operator or on the harness, never on CI.
- Step 3's token equality proves the program that runs at H is the program at B.
- Every new clause is a reading of code (note 1), and none claims a result of FIND'.
- An e2e run would test only whether FIND' is green now, and the words do not claim that. So no run on the port-5400 harness is ordered. Port 5180 and `validate` are not used.

**5. What must not change (settle 4).**
- **In regression.mjs:** every other step, comment and assertion. That includes:
  - :1930-1945 (except OPEN-2's path);
  - :1951-2255;
  - :2084-2092 and :2246-2252 (OPEN-3);
  - steps 1 to 3 and step 5;
  - `observed`;
  - the step list at :2690-2709.
- **`mp-prime-e2e-covered-fixture`'s ground:** `stepMultiPolygon` (:411-434) and its `runStep` (:2703-2705). That node is proposed (governance/PLAN.yaml:4420-4436 @ 058244086f9914525ea8e4761c7baa07ea4f6e62) and adds a step on F-1c. None of this piece's lines is in that step or the run list.
- **App.lateResult.test.tsx:** every other test and comment, including :284-285, :1215, :1247 and :1323 (OPEN-3).
- **Elsewhere:**
  - candidateArmSession.ts, tileViewportStreamManager.ts, predicate.rs and pool.rs, which are cited, not edited;
  - frontends/shell/e2e/README.md and frontends/shell/MANUAL-WALKTHROUGH.md, where no FIND' sentence of this step is stale (grep);
  - KNOWN-LIMITATIONS.md:188's "suspended FIND'" comment, which belongs to `kl-items-graded-untrue-or-stale`;
  - every line claimed by the pieces in flight.
- **Invalidators** (each stops the piece and goes to the custodian):
  - I-1: a finding no longer holds at B.
  - I-2: a fix needs a non-comment change.
  - I-3: a cited fact changed at B, as opposed to a line that moved.
  - I-4: an in-flight piece gains one of the 2 paths.
- **Block-on-sight:**
  1. A path outside the 2 files.
  2. A changed token.
  3. A clause untrue at H.
  4. A sentence claiming FIND' passes, or naming a cause of any red.
  5. An OPEN-3 line edited without the human's word.
  6. A pin split across lines, or a hash that does not recompute.
  7. Any CI entry red.

**6. Rule (00)** (governance/AUTONOMY.md:609 @ 058244086f9914525ea8e4761c7baa07ea4f6e62), against the brief's filtered lists:

| Branch | Overlap |
|---|---|
| port-2 | none |
| 1c | none |
| b1-shell-half-pr-c | none |
| #298 | none |
| #299 | export-view.mjs only; disjoint |
| #300 | none |

None of them touches protocol/. It is checked again at dispatch.

**7. Constitution check: no violation.**
- No principle (01) is reached: these are harness and test comments.
- ADR-006, docs/08 and docs/10: not reached.
- Seam rule: the repointed route was read on both sides (the manager at tileViewportStreamManager.ts:740-753, the session at :922/:1061/:1089-1103), and no `pub` item, callback or option is added.
- Red-line text in Scope: none. These are worker-written comments, not the human's wording.

---

## OPEN items

**OPEN-1. Gates.** Not a red line.
- (A) A single reviewer under §21b. No §21a category is touched and all §21c bounds hold.
- (B) The reviewer and the architect from dispatch, on the five-line form. This follows the stale-test-names reading of category 4.
- **Recommend (A).** No property or token changes, and the reviewer's clause check covers the words.

**OPEN-2. The moved form path in the named header.** regression.mjs:1930 cites `frontends/shell/FILTER-84-85-PREREGISTRATION.md`, which now lives at `governance/forms/frontends/FILTER-84-85-PREREGISTRATION.md` (governance/MOVED.tsv:67 @ 058244086f9914525ea8e4761c7baa07ea4f6e62). Its §2.4 and §3.4 resolve there (:21, :35).
- (a) Repoint the path in place on one line of 111 columns, with no rewrap, so the human's quoted ruling at :1931-1933 is not reflowed. That is +2 lines.
- (b) Leave it.
- **Recommend (a).** It is a cite inside the header the node names, and the node says "each cite repointed". This follows area A's OPEN-3 (a) custodian reading. Not a red line by my reading. If the custodian reads it as an addition, it is the human's.

**OPEN-3. Sibling stale lines the node does not name. A red line by my reading:** a scope change to a ruled item (governance/AI_DEVELOPMENT.md:451-454 @ 058244086f9914525ea8e4761c7baa07ea4f6e62).
- **The lines:**
  - regression.mjs:2084-2092 (`settledUnmintedTilesSince`'s doc) and :2250-2252 (step 4's comment). Both say an early unminted reading could produce a false PREMISE BROKEN that "would silently skip the pre-committed assertion". At main, PREMISE BROKEN is pushed only on truncation (:2266-2272), as a failure, and `unminted` is read in no branch.
  - App.lateResult.test.tsx has four more cites into candidateArmSession.ts that land on other code:
    - :284-285 and :1215 cite `:1261`-`:1269`, which is `cancelUntiledStream`. `issueUntiledQuery`'s `stopped` returns are at :1272, :1286 and :1291, and `await viewportQuery` is at :1283.
    - :1247 cites `:1674-1675`. The `query-issued` emission is at :1705.
    - :1323 cites `:136`. The `applyScanEvent` type is at :146.
- **Options:**
  - (a) The human widens this node to them: the same 2 files, about +20 lines, still inside §21c.
  - (b) Excluded here, listed in the form as known and outside the ruled Scope, and proposed by the custodian as a new node.
- **Recommend:** put (a) to the human as a one-line question before dispatch. The node waits on #299 anyway, and the human returns on 2026-11-09. Under Part 1, item 4, a disclosed unfixed sibling sends the piece back. Without an answer at dispatch, (b).

**OPEN-4. Whose words land (Part 1, item 1).** Not a red line.
- (A) The form carries, as binding, what each sentence must cover: 1a (a) to (g), 1b (a) to (f) and 1c (a) to (b). My words are a draft that the worker may adopt after re-deriving at B. The gate checks whatever lands, clause by clause.
- (B) The form carries only what each sentence must cover.
- **Recommend (A).** The code is main's and is not rebuilt, so item 1's order holds, and the words are already clause-checked.

---

## The reuse index (as given in the brief, byte for byte; the misses are noted in Authority)

```text
$ node tools/reuse.mjs stale test comments harness   (exit 1)
No prior art recorded for "stale test comments harness". Research it before planning an implementation.
$ node tools/reuse.mjs e2e step header status comment   (exit 1)
No prior art recorded for "e2e step header status comment". Research it before planning an implementation.
```

**Form path:** governance/forms/frontends/STALE-HARNESS-COMMENTS-FIND-PRIME-AND-LATE-RESULT-PREREGISTRATION.md. The forms folder goes by the files' module (governance/README.md:19 @ 058244086f9914525ea8e4761c7baa07ea4f6e62), and the template places it nowhere else.

---

## What I could not settle

- **HEAD and hashes.** I could not confirm HEAD is 058244086f99 myself (no shell), and I could not compute any sha256.
- **The line count.** About 30 to 32 lines is a count of my words, not of a diff.
- **Whether the cited lines move before B.** If candidateArmSession.ts, predicate.rs or pool.rs change between 05824408 and B, the pin rule in note 1 applies.
- **OPEN-3** waits for the human.

## Files read (all at main 058244086f9914525ea8e4761c7baa07ea4f6e62, under C:/dev/spatial-ide)

- The brief, brief-shc-draft.md in the session scratchpad.
- state/consults/2026-11-05-area-e-kl-triage-numbered-items-architect.md (whole).
- state/directives/2026-11-06-8e-words-replaced-u1-h1-h2-class-8-m10-kl-c1-c3-draft-marks-u12-mark-n1-n3-slot-2-order-clippy-placed-288-clicked.md (whole).
- state/directives/2026-11-05-main-architect-gate-rounds-part-1-rulings-review-packet-design-part-3-additions.md (whole).
- governance/PLAN.yaml (340-381, 4418-4437, 6695-6724).
- frontends/shell/e2e/regression.mjs (405-436, 1900-2342, 2690-2709; greps).
- frontends/shell/src/App.lateResult.test.tsx (280-287, 1210-1251, 1300-1429; greps).
- frontends/shell/src/residency/candidateArmSession.ts (132-139, 170-181, 1020-1109, 1258-1273, 1650-1707; greps).
- frontends/shell/src/streaming/tileViewportStreamManager.ts (730-771, 940-1029; greps).
- engine/src/pool.rs (105-139; grep).
- engine/src/predicate.rs (125-154; grep).
- frontends/shell/src/canvas/tileGridConstants.ts (grep).
- governance/MOVED.tsv (grep).
- governance/forms/frontends/FILTER-84-85-PREREGISTRATION.md (greps).
- governance/forms/frontends/POLISH-87-88-89-PREREGISTRATION.md (grep).
- governance/forms/frontends/SHELL-COMMENTS-DRIFT-SWEEP-AREA-A-PREREGISTRATION.md (whole).
- governance/forms/frontends/STALE-TEST-NAMES-AND-COMMENTS-PREREGISTRATION.md (1-401).
- governance/forms/frontends/PUBLISH-FILTER-SENTENCE-E2E-SHOWN-CASE-PREREGISTRATION.md (whole).
- state/consults/gates/2026-11-08-publish-filter-sentence-e2e-shown-case-gate1-reviewer.md (whole).
- docs/PREREGISTRATION-TEMPLATE.md (whole).
- governance/AUTONOMY.md (305-379, 474-485, 600-611, 685-699).
- governance/AI_DEVELOPMENT.md (440-461).
- governance/README.md (grep).
- frontends/shell/package.json (greps).
- frontends/shell/e2e/citationIntegrity.test.mjs (1-80).
- scripts/plan/verify-cites.mjs (1-100; grep).
- frontends/shell/e2e/README.md (108-117; grep).
- frontends/shell/MANUAL-WALKTHROUGH.md (grep).
- KNOWN-LIMITATIONS.md (grep).
