*Custodian's filing note (2026-10-23): milestone 4 PR A's buildLayers.ts sentence (Amendment 2 item 5; Amendment 4 row 16, item 2) and §4's text checks, by a worker at 35085072, on the custodian's merge of main c1f782db into the branch (8270fa00). The run 08:04:00Z to 08:18:50Z by its transcript (Bash 26, Edit 2, Read 1); its claims were read against that transcript's calls before filing: one commit and one push, origin's branch equal to the head, the porcelain empty, no force push or rebase; one `git checkout` of `buildLayers.ts` to its committed text before the scripted apply; its Edit calls only on its own scratch scripts, which it kept under `m4a-bl-` names in the user temp folder rather than the session scratch folder (disclosed, nothing tracked). **Its `npm run verify` exit, which it gives as inferred:** the call ran inside one shared hold and ended `exit $rc`, and the tool reported no error, so its exit status was 0. **§7:** the four per-file overruns it names are class 8; Amendment 4 row 2 places the two manager tests' in the closing amendment, counted at the gate head, and `document.ts`'s (D1) and `buildLayers.ts`'s (7 against 6, from Amendment 2 item 5's four lines as given) go there with them. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 11c5a3e7d277f757a6ad2f01f28f4da2618d181c8abcb56c2011ba538bd2d729.*

---

buildLayers: b1-shell-half PR A at 35085072824b5bcd657c37e3ca1603cbb1693e93

Commit: 35085072 "docs(shell): milestone 4 PR A, Amendment 2 item 5: buildLayers.ts's sentence after #243's merge", signed off. Pushed; origin/cut/b1-shell-half-pr-a == HEAD (35085072...), porcelain empty. `git -s` appends Signed-off-by after the two Co-Authored-By/Claude-Session lines, so they are not the literal last two lines.

Diff: one file, frontends/shell/src/canvas/buildLayers.ts, 3 insertions and 4 deletions. The four lines were copied by script from the form at main c1f782db (Amendment 2 item 5's code block, 5-space indent stripped; the script checked the first line equals the file's line 31). The comment now holds:
```
 * `0..1` opacity). The shell's style documents are literal-only (`style/document.ts`'s
 * `StyleDocumentV0` has no `match` variant), so this is exactly ONE colour for a whole style, not
 * a per-feature table -- a plain array, deck.gl's own "constant attribute" shape, is what this
 * type carries and what `buildLayers` below passes straight through unchanged. */
```
These are not the human's words; the PR body lists them.

Clauses at this head:
- Literal-only / no `match` variant: `frontends/shell/src/style/document.ts:109-118`. The layer fields are all `LiteralValue<...>`, and the `StyleDocumentV0` doc is at lines 103-107. PR A edits only document.ts's comment, at lines 18-22.
- Exactly ONE colour: `frontends/shell/src/canvas/buildLayers.ts:447` and `:470`, both `getFillColor: draw.fillColor`. A third use is at `:422`, `getColor: draw.fillColor`.
- A plain array that the type carries: the `fillColor` tuple at `frontends/shell/src/canvas/buildLayers.ts:36`.
- The sentence says neither that the shell requests no projection nor that `viewport_query` carries no attributes.

Text checks (a script run line by line and over joined text; joined run = leading whitespace, marker, whitespace after the marker, and trailing whitespace stripped, lines joined by one space). Counts are line/joined:
- At B (`git ls-tree` and `git show`), totals:
  - `requests none` 2/2: `style/document.ts` 1/1, `renderer/tests/style_shell_agreement.rs` 1/1.
  - `requests no projection` 2/2: `skp/client.ts` 1/1, `skp/client.test.ts` 1/1.
  - `gains no parameter` 1/1: `skp/types.ts` 1/1.
  - `carries no attributes` 1/1: `canvas/buildLayers.ts` 1/1.
  - `Proposed, so it binds nothing` 0/1: `workspace/viewTransitions.ts` 0/1, positive in the joined run only.
- At b24e5281, `requests none` in `canvas/buildLayers.ts` is 1/1 (the fifth positive). Its total there is 3/3, which also counts `style/document.ts` and `style_shell_agreement.rs`.
- At the head, all five patterns are 0/0 in every file (the first run was on the worktree before the commit; the second, after the commit and push, gave the same zeros).
- Disclosure: my first run stripped only the leading whitespace and the marker, and left the space after `*`. That gave 0 joined for the `Proposed` pattern at B. I added removal of the whitespace after the marker, which is the first worker's method (their report says the joined run is positive), and reran everything with it.

§7, over `c1f782db...HEAD` with the stated exclusions, total 1,900 lines:
- A-P 486 (ceiling 1,094), A-T 981 (ceiling 1,860), A-E 433 (ceiling 570).
- A-E by file: attributes.mjs 351 (ceiling 420), generator `kernel/tests/manual_walkthrough_fixtures.rs` 82 (ceiling 90).
- Per-file overruns of a §7 ceiling:
  - `buildLayers.ts` 7 against 6, from this commit (3+4); it was 0 in the range before it.
  - `style/document.ts` 7 against 6 (Amendment 4 row 1, D1).
  - `viewportStreamManager.test.ts` 88 against 40.
  - `candidateArmSession.test.ts` 149 against 60.
- Every other §7-listed file I checked is under its ceiling. Files outside §7's list (Amendment 3's additions, e.g. `clickEffect`, `tileIngest`, `tileResidentSet`, `testUtils/attributeBatchIpc.ts`) were counted in the groups, not against a file ceiling. Per the round 25 item 2 rule, a full-form §7 overrun is class 8 and its §7 line is not edited. I recorded nothing in the form.
- Outside the count, in the same range: KNOWN-LIMITATIONS.md 8, MANUAL-WALKTHROUGH.md 29, e2e/README.md 12.

Checks (the exit code is the tool's, none non-zero):
- `npx tsc --noEmit` in `frontends/shell`: rc=0, empty output.
- `npm run verify`: under a shared hold. The tool showed no non-zero exit, and I did not capture `$?` in the log. The log has 0 matches for npm error/ELIFECYCLE, and its last line is `ℹ todo 0` from the `test:s5d-verdict` step (7/7 pass). The vitest summary is "Test Files 104 passed (104)" and "Tests 1413 passed (1413)". Treat the rc as inferred, not printed.
- Lock diffs over `c1f782db...HEAD` for `*.lock`, `package-lock.json`, `Cargo.toml`: empty, rc=0. Changed files matching lock, Cargo.toml or protocol/: 0.
- `verify-cites.mjs` rc=0: "PASS — every rooted (in-tree) path:line reference across 2245 file(s) resolves."
- `verify-quotes.mjs` rc=0: "PASS — 131 checked, 100 verified, 30 baselined".
- `verify-test-claims.mjs` rc=0: "PASS — all 621 claimed test(s) across 190 file(s) exist or are planned, superseded or withdrawn".
- `verify.mjs` rc=0: "verify:plan PASS".
- Scripts suite under a hold, SUITE_RC=0: tests 527, pass 527, fail 0. The `guardian parity` case did not occur.
- No e2e run.

Invalidators and disclosures: no I1 file outside buildLayers.ts, no dependency/port/lockfile/SKP change, no §5 invalidator met. The class 8 overruns above are disclosed.

Hold lines (SpatialIDE only):
- MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF (verify)
- MACHINE_RELEASED project=SpatialIDE (verify)
- MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF (scripts suite)
- MACHINE_RELEASED project=SpatialIDE (scripts suite)

Process check: I started no process that is still running. The one node.exe seen is not mine. Scratch files are under the scratchpad's temp folder, named `m4a-bl-*`.

Model: Sonnet 5.5, claude-sonnet-5-5, no override, no context handoff.
