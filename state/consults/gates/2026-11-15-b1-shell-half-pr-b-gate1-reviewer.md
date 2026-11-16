Reviewed: PR #327 at 6f7e744cf6a1c1337fdaf62bfdc113c1de531f1a (the custodian's filing note, 2026-11-15: the reviewer, PLAN node b1-shell-half, milestone 4's PR B, one of its two gates from dispatch, under its form (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`, Amendment 24); dispatched at 2026-11-15T22:24:10Z by the custodian's transcript, in the background, its prompt naming the brief in the custodian's scratch folder (15573 bytes, sha256 6c4cd0d4c5eb6e8416bf7704cce1a656787f6efb79331fed7dacd3f6f8e22023); the run 2026-11-15T22:24:12Z to 2026-11-15T23:25:38Z by its transcript, 198 calls (Bash 162, Read 35, SubagentHandback 1), 3 errored (a Read refused for its size, and two reads of a hold's output: hold 2's first attempt, ended by the hold's two-holds check, and hold 6's first attempt, before its output file was written), model claude-opus-5-5; its mutations applied and reverted in its own worktree; each mutation and suite run it claims has a call behind it, by the custodian's audit; received at 2026-11-15T23:25:38Z by the custodian's transcript; the report below, byte for byte, from its hand-back of 34375 bytes, sha256 5e893a7c7016804b6a647b2591527e37edd5fcd5d13f9b21cb8dd08959fd5e19, with this note added in its first line), gate 1, reviewer
Verdict: PASS WITH NOTES

Branch and commit: cut/b1-shell-half-pr-b @ 6f7e744cf6a1c1337fdaf62bfdc113c1de531f1a (H). B = 2abf3ea087cb53cf5cbb57b844f7c2ad6a92a89a. Main = 6346c763fa0054d92280b5194e544ff637c877ed. Worktree <W> = C:/dev/wt/m4b-g327r, detached at H; target D:/wt-targets/m4b-g327r. Model: claude-opus-5-5. Brief: <S>/brief-g327r.md, 15573 bytes, sha256 6c4cd0d4c5eb6e8416bf7704cce1a656787f6efb79331fed7dacd3f6f8e22023, both shown by command.

No finding is in Correctness or Evidence. Six findings are Documentation must-fixes before the merge: D1 to D6.

## Findings

### Correctness
None. All 30 recorded mutations failed. 29 failed where their comments say, and two of those also failed tests the comment does not name (D4, D5). The PB-R1 legend mutation failed as recorded, but only on my second, faithful application: my first application was a no-op (O7). All suites at H passed. Nothing PR B adds puts JSON on a data path, makes a synchronous canvas call, assumes a CRS, or sends float32 coordinates without an offset.

### Evidence
None. Flag 6: no result recorded in the form rests on the 17:09:05Z to 17:31:09Z window alone (O3).

### Documentation (must-fix before the merge; replacement words are in the Drafts section)

**D1. §7 overrun not recorded as class 8: `renderer/tests/style_agreement.rs` is at 49 lines against a ceiling of 40.**
- Before H it was at 34. H's rustfmt commit added 15 lines.
- Neither Amendment 15 nor Amendment 18 records this overrun. The overruns they do record were all reproduced by §7's own command over B...H.
- Fix: the closing amendment records the overrun as class 8 (round 25 item 2). §7's line is not edited to match.

**D2. KNOWN-LIMITATIONS.md item 54 (the advisor's draft): the sentence "A request Colour by made is cancelled by Colour by's Cancel and when an export starts" reads as a complete list, and it is not.**
- The source is the Table's own source, so the following also cancel a request Colour by made:
  - **A session end.** frontends/shell/src/table/TableTab.tsx:69-71 at H calls `source?.end()`. The tab runs it while hidden, because panels stay mounted with the hidden attribute.
  - **Opening another dataset.** frontends/shell/src/App.tsx:1431-1451 at H runs `source.dispose()`. Dispose calls cancel (frontends/shell/src/table/tableSource.ts:191-193 at H).
  - **Any change that ends the Table's effect, while the Table is shown in the Filtered scope.** TableTab.tsx:63-67 at H has the cleanup `return () => source.cancel();`, which cancels whichever handle the source holds.
- Ordinary use reaches the last case:
  1. Show the Table, Filtered.
  2. Press the Table's Cancel. The phase is now cancelled, so the request is neither reusable nor joinable.
  3. Apply Colour by. It issues its own request (frontends/shell/src/style/categoryCases.ts:58-62 at H).
  4. Hide the Table. The cleanup cancels Colour by's request, and Colour by applies nothing.
- These are not the human's words. Replacement words, checked clause by clause, are in Drafts §1.

**D3. KNOWN-LIMITATIONS.md item 66's source comment says "a space at the start or end of a name is shown as part of the single space beside it". For the end of a name this is untrue.**
- compose_published_columns (frontends/shell/src-tauri/src/publish.rs:322-331 at H) writes `Columns published: id, the geometry, and {}.`. The one name the shipped build derives is last and is followed directly by ".".
- Trailing whitespace therefore collapses to one visible space before the full stop. No CSS rule changes white-space for `.publish-dialog-columns`: frontends/shell/src/styles.css:949-952 at H sets only margin-left and overflow-wrap.
- A leading space does merge with the space after "and".
- The sentence is in a comment, not the item's text. Words are in Drafts §2.

**D4. The PB-U5 recorded-mutation comment omits part of what the mutation fails at H** (frontends/shell/src/canvas/buildLayers.test.ts:654-657 at H).
- The mutation `++matchFillRevision` fails PB-U5 as recorded. It also fails all three PB-U12 tests, on `samePaintAgain` (expected false, received true).
- PB-U12 was added at da75aa91, before ff01d919. Yet the "OBSERVED AGAIN AT ff01d919…" line names PB-U5 alone.
- Fix: the worker observes the mutation again and appends the three PB-U12 failures (byte-copied under m08 below).

**D5. The PB-U6 recorded-mutation comment omits part of what the mutation fails at H** (frontends/shell/src/workspace/viewTransitions.test.ts:107-109 at H).
- The literal keeps fillMatch. It also fails "PB-U6: the transitions toward the default style, from a match whose literal fill is the default's, leave fillMatch null", a test added at da75aa91, after the 572bb917 observation.
- Fix: the worker observes the mutation again and appends this failure (byte-copied under m28).

**D6. Precision of item 65's added last sentence (the advisor's draft) and the same clause in item 51.**
- "a batch that holds no values of the chosen column" can be read as "a batch whose values are all NULL". Such a batch draws as No value, not Other: rowGroups gives Other only when `values === null`, in frontends/shell/src/canvas/matchGroups.ts at H.
- The finding underneath is correct, by rowGroups and readColumn/keepMatchColumn (frontends/shell/src/attributes/values.ts at H). Only the words are imprecise.
- Words are in Drafts §3. Both items must stay consistent (flag 2 (e)).

### Observation
- **O1. Two holds ended at exit 95 ("holds of this project after the grant: 2"):** hold 2's first attempt and hold 6's first attempt.
  - In both, the status read just before showed no project line. Another hold of this project was granted between my read and my grant.
  - The command never ran in either. I read the status again and held again. No heavy run of mine ran beside another hold of this project, so ADV-2026-11-15-17 item 4 (b) did not apply.
- **O2. CI at H: one red row**, macOS L1 (pull_request run 43768550346):
  - `cancelling_before_the_first_batch_stops_the_stream_without_producing_anything` panicked at engine/tests/slice.rs:815:18: "expected a cancelled terminal, got Some(Ok(BatchInfo { rows: 154, ... }))".
  - This is engine timing. PR B touches no engine file, and the push run 43768544608 of the same workflow passed.
  - Re-read at 2026-11-15T23:23:28Z: unchanged. Every other row passes. CI green remains a merge condition.
- **O3. Flag 6.** cb3-u ran at 16:48:01Z, before the window, on the old exe.
  - The window holds the M-PB-E2 and M-PB-E2c observations, the build and rebuild of exe 01073a95…, and cb3-r (the colour suite's only pass on the current exe). These rest on the window alone.
  - The M-PB-E2 and M-PB-E2c failures are content mismatches (published_columns text, manifest names, style.json, viewer colours) and not load-sensitive.
  - The tester's series at H re-observes all of them. No result recorded in the form is affected.
- **O4. `frontends/shell/e2e/colour.mjs:220` does `await import("esbuild")`.** esbuild is not a direct dependency of the shell; it arrives transitively through vite (0.25.12). A vite upgrade could drop it.
- **O5. readColumn reads Utf8 only (`DataType.isUtf8`), while admitsMatchKeyType also admits LargeUtf8 and Utf8View.**
  - decodeBatch already refuses those types, so no reachable path differs. The gap predates PR B.
  - Records it as a seam to keep in step if decodeBatch ever admits them.
- **O6. package.json carries no §7 B ceiling row.**
- **O7. My own procedure:** mutation 17's first application (m17) was a no-op.
  - Legend entries have no `label` field, so the sort compared undefined values. The run passed (2 passed).
  - It was not the recorded mutation, so I applied the recorded one faithfully (m17b), which failed as recorded.
  - m17 is disclosed here as void, not as coverage.

## Checks

**Check 1 (start).**
- The tester's worktree C:/dev/wt/m4b has HEAD = H and an empty porcelain (0 lines).
- `git ls-remote` gives H. The fetch exited 0, and the merge-base is B.
- <W> was created at H.
- `df` at start: C: 51G free, D: 365G free.

**Check 2 (npm ci).**
- The shell (hold 1): rc 0, 196 packages added.
- bundle-viewer (hold 2, second attempt): rc 0.
- The porcelain stayed 0 after each, and no lockfile changed.

**Check 3 (diff).**
- `git diff --numstat B...H`: 54 files, 2661 added and 209 removed.
- No path under protocol/, kernel/src, engine/ or frontends/shell/src-tauri/. No lockfile and no Cargo.toml.
- Flag 8:
  - `git diff 0cf05452 H` touches renderer/tests/style_agreement.rs alone, and is rustfmt's re-wrap only.
  - `cargo fmt --check` exits 0 in the workspace and in src-tauri.
- Changed-paths list: none of the 54 paths changed on main from B to 6346c763 (empty).

**Check 4 (§7 over B...H).**
- B-P 979, B-T 1356, B-E 472; 2807 in all.
- Amendment 15 recorded these overruns, and my count reproduces them: FeatureTab.tsx 17/15, selection.ts 7/6, App.test 40/35, pick.test 21/20, App.lateResult 53/40.
- Amendment 18 recorded these, also reproduced: values.ts 56/40, the OPEN-20 group 74/65, decodeBatch.ts 17/16, StudioLayout.test 67/60.
- Not recorded: style_agreement.rs 49/40 (D1).

**Check 5 (§4 text checks).** Each pattern was self-tested positive first. 0 matches at H.

**Check 6 (suites).**
- `npm run verify` in the shell (hold 3): rc 0.
  - typecheck, the checks, the build and the dist checks passed.
  - vitest: Test Files 118 passed, Tests 1498 passed.
  - residency-trace 76 passed / 0 failed; citation-integrity 30 passed / 0 failed; export-elapsed 5/5; s5d-verdict 7/7.
- The bundle-viewer build (hold 4): rc 0. The scan's last lines, byte-copied:
  `scan-dist: 3 files scanned, 2 findings, all reviewed; record written` / `scan-dist: reviewed row NOTICE.txt credential 19092: matched` / `scan-dist: reviewed row NOTICE.txt local-filesystem-path 111337: matched` / `scan-dist: reviewed row app.js local-filesystem-path 7291: not found`
- `CARGO_TARGET_DIR=<T> CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8 cargo test -p spatial-renderer --locked` (hold 5): rc 0. lib 31 passed; style_agreement 2 passed; style_shell_agreement 1 passed; doc 0.
- The porcelain stayed 0 throughout.

**Check 8 (light runs at H).**
- `node --test`: rc 0. 606 tests, 606 passed, 0 failed.
- verify-cites: rc 0, PASS, 3111 files, 192 loose advisories.
- verify-test-claims: rc 0, PASS, 812 claims.
- `verify.mjs --offline`: rc 0, PASS.
- verify-quotes (hold 7): rc 0. "verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 936 ruling cites resolved, 0 ruling-cite errors."

**Check 9 (records and comments, clause-checked at H).**
- Item 4's On-main sentence (KNOWN-LIMITATIONS.md:80 at H) is true: document.ts writes a match only on fill_color.
- Item 59 (lines 493-494 at H) is true. It is backed by style_attributes, main.ts's hover, and item 47's search.
- Flag 7: checked by node script. Lines 80 and 493-494 equal OPEN-A and OPEN-B (state/consults/2026-11-12-b1-shell-half-pr-b-re-sweep-amendment-architect-draft.md, lines 262 and 272), with "item 64" changed to "item 65" exactly once each and no other byte changed.
- Item 51's draft: each clause holds against:
  - limits.ts withinAttributeCeiling;
  - values.ts keepMatchColumn and readRow;
  - the App.tsx colour effect at lines 2053-2062, which refills when colourColumn !== previous and attributesNotHeld === dataset, through issueQueryRef under activeFilterRef;
  - setAttributesNotHeld, set only at App.tsx:2288;
  - candidateArmSession reissueUnrestricted: clearAll, clearAllTiles, resetFitForNewGeneration, hasPlanned = false;
  - UNTILED_FIRST_LOOK_ROW_LIMIT.
  The one exception is the D6 precision.
- Item 54: D2. The other clauses hold:
  - the Table asks only while it is shown;
  - Colour by asks unless completed, stopped or loading under the same filter;
  - it applies nothing with an export held;
  - the joined-request cases;
  - the restart-and-clear clause.
- Item 56's clause on a third occasion (the Colour by refill) holds.
- Item 65: the finding underneath is correct; D6 for precision.
- Item 66: D3.
- Walkthrough rows F5 (MANUAL-WALKTHROUGH.md:277 at H) and G3 (line 335 at H): neither is untrue in its own steps.
  - F2's fill pick clears fillMatch, so F5's document is the literal.
  - G1 sets a literal style, so G3's line is "id and the geometry only."
- AC3, AC4, AC5, AC10 and AC12 hold.
  - AC4: the line is empty and the button disabled.
  - AC5: the line follows the row scope, and the viewer shows `(no value)` (renderer/bundle-viewer/src/main.ts:458 at H). The viewer legend's labels differ in words, but its entries match.
  - AC12: the refill gives every new batch the column, so its "Other" clause is conditional and not reached.
- e2e README colour entry (frontends/shell/e2e/README.md, +12 lines): each stated step matches colour.mjs at H:
  - LOCALAPPDATA scratch at line 30;
  - the CDP refusal at line 408;
  - the step order at lines 439-444;
  - the 10-second wait in PB-E3 (`timeoutMs = 10_000`, line 88);
  - PB-E4's two fillColor steps at lines 359-360.

**Check 10 (flags 6, 8, 9).**
- Flag 6: O3.
- Flag 8: Check 3.
- Flag 9: `git diff --stat dfb96279 H` touches 6 files, and none is a product source:
  - KNOWN-LIMITATIONS.md;
  - the walkthrough;
  - colour.mjs (comment lines only);
  - buildLayers.test (+4 comment lines) and viewTransitions.test (+2 comment lines);
  - style_agreement.rs.
  src-tauri has 0 files. The exe D:/wt-targets/m4b/exes/spatial-ide-shell-m4b.exe is 91555840 bytes, sha256 01073a95deabb32efdc6ac03c3625fd2a5beb22a36ee6c07a5bb92068fb41b9b, which matches. Flag 9 holds.

**Check 11 (CI).**
- `gh pr checks 327` at 22:52:30Z: rc 1. Read again at 23:23:28Z: rc 1. Both reads show the same rows. Every run's head sha is H.
- Only macOS L1 pull_request run 43768550346 is red (O2).
- Passing:
  - macOS push run 43768544608;
  - Rust fmt, both runs (43768544567, 43768550253);
  - Windows, ubuntu, cfg boundary, DCO, profile path, ported-notices, tauri build and governance;
  - the shell (43768550367) and the bundle viewer (43768550313).

**Check 12 (end).** At 23:22:28Z:
- <W>: HEAD = H, porcelain 0 lines.
- C:/dev/wt/m4b: HEAD = H, porcelain 0 lines.
- `df -h /c /d`: C: 50G available (90% used); D: 365G available (22% used).
- <W> and <T> are left in place.

## Mutations (each applied alone by an anchored `node -e` that refused unless its anchor occurred exactly once; every apply_rc 0; `git diff` shown; reverted by `git checkout -- <file>`; each revert left `git diff` 0 bytes and the file's sha256 equal to `git show H:<file>`)

Vitest ran from <W>/frontends/shell, and each output is at <S>/g327r-mNN.txt. All file paths below are under frontends/shell/src unless a full path is given. The six M-PB-E mutations were excluded.

- **m01 — PB-R2.** viewTransitions.ts: the recorder is sent `next.fillColor`. Run: App.colour.test.tsx. 3 failed / 1 passed, as recorded:
  - "PB-R2: the apply records one style.set whose intent is the wire fixture's, with the product's colours": `AssertionError: the intent, in the wire fixture's shape and order: expected { action: 'style.set', …(1) } to deeply equal { action: 'style.set', …(1) }`
  - "PB-U11: with the not-held state standing, a Colour by on a new column issues one re-issue…": `AssertionError: one re-issue of the first look beside one cases query: expected [ 1, 1 ] to deeply equal [ 2, 1 ]`
  - "PB-U11: with no not-held state, a Colour by issues its cases query and no re-issue": `AssertionError: the style was applied: expected undefined to be 'zone' // Object.is equality`
  - Revert sha 5acd4724…
- **m02 — PB-R4.** categoryCases: "cancelled" read as rows. 1 failed / 3 passed, as recorded:
  - "PB-R4: hiding Activity while the apply waits on the Table's stream applies no style and says so, and with an export held no viewport_query is issued": `AssertionError: the line after the cancel: expected '[P6 placeholder] Coloured by zone: 2 …' to contain 'Nothing was applied'`
  - Revert sha 8c93cbe1…
- **m03 — PB-U11.** App.tsx: the re-issue replaced by `void attempt;`. 1 failed / 3 passed, as recorded:
  - PB-U11 (not-held standing): `expected [ 1, 1 ] to deeply equal [ 2, 1 ]`
  - Revert sha b97ab963…
- **m04 — SE-R1.** App.tsx: dispatch reason "source-changed". Run: App.lateResult.test.tsx. 1 failed / 21 passed, as recorded:
  - "…a session ended by the real dataset_session_ended route for coverage-lost names coverage-lost in the hover readout, the notice, the status bar item and the last click": `AssertionError: the notice names the lost watch: expected '[P6 placeholder] The selection ended:…' to contain 'lost coverage'`
- **m05 — SE-U1.** sessionEndReasonOf returns "source-changed". Runs: App.test.ts and viewportStreamManager.test.ts. 2 failed / 114 passed, as recorded:
  - "handleSessionEnded names coverage-lost from the kernel's real coverage-lost details, and source-changed only from its exact code": `expected 'source-changed' to be 'coverage-lost'`
  - "SH7: a matching dataset_session_ended event ends a real baseline manager's session through the full route": `AssertionError: expected "vi.fn()" to be called with arguments: [ { kind: 'session-ended', …(1) } ]`
- **m06 — SE-U2.** sessionEndedText returns HOVER_SESSION_ENDED_TEXT. Run: HoverReadoutView.test.tsx. 1 failed / 5 passed, as recorded:
  - `AssertionError: the coverage-lost readout names the lost watch: expected 'The source file changed while it was …' to contain 'lost coverage'`
  - Revert sha 6667a801…
- **m07 — PB-U3.** rowGroups: Other mapped to 0 for non-null. Runs: buildLayers.test.ts and matchGroups.test.ts. 2 failed / 32 passed, as recorded:
  - `polygon datum 3 (row 2, zzz): expected [ 170, +0, +0, 128 ] to deeply equal [ 204, 204, 204, 128 ]`
  - PB-U10b: `the groups of the full block: expected [ +0, 2, +0, 1, +0 ] to deeply equal [ +0, 2, 3, 1, +0 ]`
  - Revert sha 58f1000c…
- **m08 — PB-U5.** buildLayers.ts: the trigger becomes `++matchFillRevision`. 4 failed / 28 passed. PB-U5 failed as recorded; the three PB-U12 failures are not recorded (D4):
  - PB-U5: `AssertionError: the trigger after ten pans: expected { getFillColor: [ 17 ] } to deeply equal { getFillColor: [ 7 ] }`
  - PB-U12 polygonal: `AssertionError: deck.gl's view of the getFillColor change for polygonal: expected { matchToOneColour: true, …(4) } to deeply equal { matchToOneColour: true, …(4) }` (diff: `-   "samePaintAgain": false,` `+   "samePaintAgain": true,`)
  - PB-U12 point and PB-U12 line (`getColor`): the same assertion and diff.
  - Revert sha 42d6e5c6…
- **m09 — PB-U12.** triggersOf returns `{}` for ONE_COLOUR_TRIGGER. 4 failed / 28 passed, as recorded:
  - PB-U5: `the accessors a one-colour fill triggers: expected [] to deeply equal [ 'getFillColor' ]`
  - Three PB-U12 tests: `expected { matchToOneColour: false, …(4) } to deeply equal { matchToOneColour: true, …(4) }`
- **m10 — PB-U10a.** limits.ts: `const kept = null;`. 1 failed / 4 passed, as recorded:
  - `AssertionError: the kept block: expected [ undefined, undefined, undefined ] to deeply equal [ [ 'tag' ], 'match', null ]`
  - Revert sha e4199d59…
- **m11 — PB-U10b.** readColumn also requires `block.kept !== "projection"`. 1 failed / 1 passed, as recorded:
  - `the groups of the match block: expected [ 3, 3, 3, 3, 3 ] to deeply equal [ +0, 2, 3, 1, +0 ]`
  - Revert sha 4a965d80…
- **m12 — SE-U5.** latchedHoverReadout reason "source-changed". 1 failed / 13 passed, as recorded:
  - "the latch carries the reason it is given": `the latched readout for coverage-lost: expected { kind: 'session-ended', …(1) } to deeply equal { kind: 'session-ended', …(1) }`
  - Revert sha 3b8c38ac…
- **m13 — SE-U3.** FeatureTab `because` hard-coded to "the source file changed". 1 failed / 10 passed, as recorded:
  - "the notice and the last-click line name each end reason in their own words": `the coverage-lost notice: expected '[P6 placeholder] The selection ended:…' to be '[P6 placeholder] The selection ended:…'`
  - Revert sha 3ebd7a07…
- **m14 — /colour.** layout/StudioLayout.tsx, `layer.revealStyle`: `tab !== "style"` / `tab: "style"` changed to `"layer"`. Run: StudioLayout.test.tsx. 1 failed / 9 passed, as recorded:
  - "/colour opens the Inspector if it is closed and selects its Style tab, with a dataset open and not without one": `AssertionError: the Inspector, its Style panel and its Layer panel: expected [ true, false, true ] to deeply equal [ true, true, false ]`
  - Revert sha eec79b97… (equal)
- **m15 — /table.** StudioLayout.tsx, `layer.revealTable`: `"table"` changed to `"console"`. 1 failed / 9 passed, as recorded:
  - "/table opens Activity if it is closed and selects its Table tab": `AssertionError: Activity, its Table panel and its Console panel: expected [ true, false, true ] to deeply equal [ true, true, false ]`
  - Revert sha eec79b97…
- **m16 — reveal entries.** layout/actionRegistry.ts: the `layer.revealTable` entry line removed. 1 failed / 36 passed, as recorded:
  - "holds exactly the fifteen ids: …": `AssertionError: expected [ 'command.focus', …(13) ] to deeply equal [ 'command.focus', …(14) ]`
  - Revert sha dcf92bd8…
- **m17 — void (O7).** Legend.tsx: sorted by a nonexistent `.label` field, so the sort did nothing. vitest rc 0, 2 passed. Revert sha 64ba7ddf…
- **m17b — PB-R1 legend.** Legend.tsx: entries sorted by the label the component computes (`l(x) < l(y)`). 1 failed / 1 passed, as recorded:
  - `AssertionError: labels in the resolver's legend order: expected [ …(5) ] to deeply equal [ 'park', 'civic', …(3) ]`
  - Revert sha 64ba7ddf…
- **m18 — PB-R1 chooser.** StylePanel.tsx: `columns.filter((c) => admitsMatchKeyType(c.arrowType))` changed to `columns.filter(() => true)`. 1 failed / 2 passed, as recorded:
  - `AssertionError: the chooser's options, the empty choice first: expected [ '', 'tag', 'area', 'day', …(3) ] to deeply equal [ '', 'tag', 'wide', 'view' ]`
  - Revert sha 838de7ce…
- **m19 — PB-U8.** StylePanel.tsx: `waitForFirstScope(source, filter)` changed to `(source, null)`. 1 failed / 2 passed, as recorded:
  - `AssertionError: viewport_query calls: dataset, bbox, bbox CRS, limit, filter, projection: expected [ Array(1) ] to deeply equal [ Array(1) ]`
- **m20 — PB-R3.** StylePanel.tsx: `    wait?.abandon();` removed. 1 failed / 2 passed, as recorded:
  - `AssertionError: the stream the apply issued: expected "vi.fn()" to be called with arguments: [ 'sh_1' ]`
- **m21 — PB-U2.** categoryCases.ts: `.sort(compareCodePoints)` changed to `localeCompare`. 1 failed / 5 passed, as recorded:
  - `AssertionError: the distinct non-null values, by code point (an astral character after U+FF5E): expected [ '', '～', '😀', 'a', 'b', 'B' ] to deeply equal [ '', 'B', 'a', 'b', '～', '😀' ]`
  - Revert sha 8c93cbe1…
- **m22 — PB-U9 (i), (ii), (v).** categoryCases.ts: `const issuedHere = true;`. 3 failed / 3 passed, as recorded:
  - (i): `Error: Test timed out in 5000ms.`
  - (ii): `AssertionError: viewport_query calls with the stream joined: expected "vi.fn()" to be called 1 times, but got 2 times`
  - (v): `AssertionError: cancel calls for a joined stream: expected "vi.fn()" to not be called at all, but actually been called 1 times`
- **m23 — PB-U9 (v).** categoryCases.ts: `if (issuedHere) source.cancel();` changed to `source.cancel();`. 1 failed / 5 passed, as recorded:
  - (v): the same assertion as in m22.
- **m24 — PB-U1.** document.ts: `on_null: normalizeColor(match.onNull), ` removed. 3 failed / 9 passed, as recorded:
  - PB-U1: `the fill_color a fillMatch writes: expected { match: { column: 'zone', …(2) } } to deeply equal { match: { column: 'zone', …(3) } }`
  - "the match is closed at construction…": `equal values keep the first: …(2) … …(3)`
  - PB-U4: `the document the shell writes for the vector's style: expected { style_version: 1, layer: { …(5) } } to deeply equal { style_version: 1, layer: { …(5) } }`
  - Revert sha 389961b5…
- **m25 — PB-U4.** document.ts: `when: c.when.toLowerCase()`. 1 failed / 11 passed, as recorded:
  - `AssertionError: a case keeps its case: expected '#cccccc' to be '#123456' // Object.is equality`
- **m26 — PB-U7 (TS).** renderer/style-ts/src/style.ts: `|| arrowType.startsWith('Dictionary')` added. Run: src/style/matchKeyRule.test.ts. 1 failed, as recorded:
  - `AssertionError: admitsMatchKeyType(Dictionary(Int32, Utf8)): expected true to be false // Object.is equality`
  - Revert sha 4783780c…
- **m27 — SE-U4.** workspace/workspaceState.ts: `endViewGeneration(views[id], "source-changed")`. Run: selection.test.ts. 1 failed / 14 passed, as recorded:
  - "a generation ended by coverage-lost ends the selection with the reason coverage-lost": `AssertionError: the notice a coverage-lost end leaves: expected { kind: 'ended', …(2) } to deeply equal { kind: 'ended', …(2) }`
  - Revert sha eba4b737…
- **m28 — PB-U6.** workspace/viewTransitions.ts: `fillMatch: null` dropped from the literal branch. 2 failed / 8 passed. The first failure is recorded; the second is not (D5):
  - `AssertionError: a literal fill: expected [ '#112233', { column: 'zone', …(3) } ] to deeply equal [ '#112233', null ]`
  - "PB-U6: the transitions toward the default style, from a match whose literal fill is the default's, leave fillMatch null": `AssertionError: the match after the transitions toward the default: expected { column: 'zone', …(3) } to be null`
  - Revert sha 5acd4724…
- **m29 — PB-U6 reset.** viewTransitions.ts: `|| prev.fillMatch !== null` dropped. 2 failed / 8 passed, as recorded:
  - "styleTransitions emits one match transition…": `AssertionError: the match ending at the same fillColor: expected [] to deeply equal [ '#112233' ]`
  - The reset test: `expected { column: 'zone', …(3) } to be null`
- **m30 — PB-U7 (Rust).** renderer/tests/data/style-agreement.json: the `Dictionary(Int32, Utf8)` row set to `"admitted": true`. Run: `CARGO_TARGET_DIR=<T> CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8 cargo test -p spatial-renderer --locked --test style_agreement` in hold 6. rc 101, as recorded:
  - `test the_match_key_rule_admits_exactly_the_vectors_admitted_rows ... FAILED`
  - `assertion \`left == right\` failed: admission of Dictionary(Int32, Utf8)` / `left: false` / `right: true`
  - `test result: FAILED. 1 passed; 1 failed`
  - Revert sha ef634026… (equal)

## Holds
All dates are 2026-11-15. Every also= value is `<m>`. Each read gives quiet, average and peaks-over-25.

| Hold | Read before (time; project line; quiet, average, peaks) | Grant | Read after (quiet, average, peaks; onehold) | Command | End |
|---|---|---|---|---|---|
| Pre-hold-1 reads | Read 1, 22:26:18Z: a project line present (quiet=False, average=30.8%). A wait loop cleared it at 22:29:49Z. | | | | |
| 1 | Read 2, 22:31:06Z; none; False, 14.9%, — | 22:31:14.393Z | False, 21.8%, 8; onehold 1 | npm ci, shell: rc 0 | about 22:32Z |
| 2, attempt 1 | Read 3, 22:34:14Z; none; False, 21.7%, 10 | 22:35:36.611Z | onehold printed 2 holds; exit 95 | did not run | released at once |
| 2 (wait) | A wait loop cleared at 22:38:10Z | | | | |
| 2 | Read 4, 22:39:00Z; none; False, 28.6%, 44 | 22:40:14.621Z | 30.9%, 50; onehold 1 | npm ci, bundle-viewer: rc 0 | 22:41:24Z |
| 3 | Read 5, 22:42:52Z; none; False, 31.8%, 54 | 22:44:04.383Z | 25.5%, 28; onehold 1 | `npm run verify`: rc 0 | 22:49:15Z |
| 4 | Read 6, 22:50:24Z; none; False, 37.5%, 60 | 22:51:37.187Z | 34.7%, 60; onehold 1 | bundle-viewer build: rc 0 | 22:52:47Z |
| 5 | Read 7, 22:53:10Z; none; False, 30.7%, 60 | 22:54:23.147Z | 34.8%, 60; onehold 1 | `cargo test -p spatial-renderer`: rc 0 | 22:56:45Z |
| 6, attempt 1 | Read 8, 23:08:03Z; none; False, 25.9%, 23 | between 23:08:03Z and 23:09:30Z | False, 27.4%, 27; two project lines; onehold printed 2; exit 95 | did not run | released by 23:09:44Z |
| 6 | Read 9, 23:10:54Z; none; False, 24.3%, 11 | by 23:11:11Z | False, 23.7%, 9; onehold 1 | m30: rc 101 (the expected failure) | by 23:12:17Z |
| 7 | Read 10, 23:13:35Z; none; False, 23.9%, 7 | by 23:16:50Z | False, 18.0%, 3; onehold 1 | verify-quotes: rc 0 | about 23:22:08Z (output mtime) |

## Drafts for the advisor

### §1. KNOWN-LIMITATIONS.md item 54
Not the human's words: the advisor's draft (ADV-2026-11-15-19 item 4 (b)). Replace the sentence "A request Colour by made is cancelled by Colour by's Cancel and when an export starts; Cancel on a request Colour by only joined cancels nothing but the wait." with:

> A request Colour by made is cancelled by Colour by's Cancel, when an export starts, when the session ends and when another dataset is opened, and, while the Table is shown with that scope, by each change that cancels a request the Table made; Cancel on a request Colour by only joined cancels nothing but the wait.

Clause check at H:
- **"by Colour by's Cancel"**: handleCancelColourBy calls `wait.abandon()` (StylePanel.tsx). abandon calls `if (issuedHere) source.cancel();` (categoryCases.ts:68). m20 and m23 bite here.
- **"when an export starts"**: handleExportRunning, `tableSourceRef.current?.cancel()` (App.tsx:1211).
- **"when the session ends"**: TableTab.tsx:69-71, `if (sessionEnded) source?.end()`. The tab stays mounted while hidden, and end cancels the stream. tableSource.ts:244 also calls `this.end()` on its own session end.
- **"when another dataset is opened"**: App.tsx:1431-1451, whose cleanup runs `source.dispose()`. dispose sets disposed and calls cancel (tableSource.ts:191-193). In product code, only replacement changes `admitted`: there is no `setAdmitted(null)`.
- **"while the Table is shown with that scope, by each change that cancels a request the Table made"**: TableTab.tsx:63-67. The cleanup `source.cancel()` runs on every dependency change once the effect has started: shown, scope, exportHeld, sessionEnded, viewFilter. It cancels the source's single handle, whoever issued it. Reached in ordinary use by the path in D2.
- **"Cancel on a request Colour by only joined cancels nothing but the wait"**: categoryCases.ts:68 cancels only `if (issuedHere)`. m22 and m23 bite here.
- Not covered: nothing timing-only.

### §2. KNOWN-LIMITATIONS.md item 66's source comment
Not the human's words; a comment. Replace "and a space at the start or end of a name is shown as part of the single space beside it" with:

> a space at the start of a name is shown as part of the single space after the word and, and a space or run of whitespace at the end of a name is shown as one space before the closing full stop

Clause check at H:
- publish.rs:322-331 formats `Columns published: id, the geometry, and {}.`, and the shipped build derives one name at most (publish.rs style_attributes).
- PublishDialog.tsx:265 renders the line as text in `<dd className="publish-dialog-columns">`.
- styles.css:949-952 (`.publish-dialog-fields dd`) sets only margin-left and overflow-wrap. No white-space rule applies; the rules at lines 142, 310, 443, 769, 1169, 1213, 1394 and 1480 have other selectors.
- Default white-space collapsing therefore merges a leading space with the space after "and". A trailing run collapses to one space, kept visible because "." follows it.

### §3. Item 65's last sentence and item 51's clause (D6)
Neither is the human's words. Item 65's is the advisor's draft (ADV-2026-11-15-20 item 2). Item 51's is the advisor's draft (ADV-2026-11-14-15 item 5 (b)).

- **Item 65.** Replace "A feature in a batch that holds no values of the chosen column draws as Other, whatever its value, until that batch is replaced (item 51)." with:

  > A feature in a batch the map keeps without that column's values (item 51) draws as Other, whatever its value, until that batch is replaced.

- **Item 51.** Replace "A feature in a batch that holds no values of the column the map is coloured by draws as Other until that batch is replaced." with:

  > A feature in a batch the map keeps without the values of the column the map is coloured by draws as Other until that batch is replaced.

Clause check at H:
- rowGroups (matchGroups.ts): `groups[row] = values === null ? style.unmatchedGroup() : style.groupFor(values[row]);`
- readColumn (values.ts) returns null for: no block; a not-held block; a block whose kept match column is a different column; a non-Utf8 column.
- keepMatchColumn keeps only the column the style matches at push time (limits.ts withinAttributeCeiling: `const kept = matchColumn === null ? null : keepMatchColumn(block, matchColumn);`). Its matchColumn comes from WorkingCanvas.tsx:1081.
- A batch whose values are all NULL has `values !== null`, so it draws as No value. The new words exclude it, and the old words can be read to include it.
- "until that batch is replaced": the App.tsx:2053-2062 refill replaces batches when the column changes.

### §4. Recorded-mutation comments (D4, D5)
Not the human's words. These need the worker's own re-observation.
- After buildLayers.test.ts:657, append an "OBSERVED AGAIN AT <commit>" line naming the three PB-U12 failures (the m08 lines above).
- After viewTransitions.test.ts:109, append "The same mutation also failed, in this file: OBSERVED AT <commit>: FAILED -- "PB-U6: the transitions toward the default style, from a match whose literal fill is the default's, leave fillMatch null": AssertionError: the match after the transitions toward the default: expected { column: 'zone', …(3) } to be null. Reverted after observing."

### §5. The closing amendment (D1)
Record as class 8: `renderer/tests/style_agreement.rs` at 49 lines against §7's B ceiling of 40, by §7's command over B...H. 15 of those lines came from the rustfmt commit H. The §7 line itself stays unedited.

## Background shells
None of mine is running. Every background task I started has reported completed. The machine shows three `sleep` processes under shells I did not start; I left them alone.

## Files
- Mutation outputs: <S>/g327r-m01.txt to <S>/g327r-m30.txt, plus <S>/g327r-m17b.txt.
- verify-quotes output: <S>/g327r-quotes.txt.
- Status reads: <S>/g327r-status-1.txt to <S>/g327r-status-10b.txt.
- CI reads: <S>/g327r-checks-2.txt.
- Full diff: <S>/g327r-diff.txt.