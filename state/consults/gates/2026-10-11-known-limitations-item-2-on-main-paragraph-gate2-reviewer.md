# PR #205 gate 2 — reviewer
Reviewed: cut/known-limitations-item-2-on-main-paragraph @ ef401e830c74fd1e369dfa42fa894a52385ac2da

**Verdict: FAIL, on one Correctness finding (C-1).** The last clause of the human's second sentence is untrue at base 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23. Following the form's Change line, it goes to the human and is not reworded. Every mechanical check passes: the byte-copy, item 3 unchanged, the scope, all 8 pins, the PR body's block, the governance scripts and CI. Gate 1's E-1, D-1 and D-2 are resolved. The worktree is clean at the head.

## Correctness

**C-1 (blocking, for the human). The clause "asserting the CRS the file is really in opens it" is untrue at the base, in two ways.**

1. **In the app, this refusal offers no way to assert a CRS.**
   - `formFamilyForCode` opens the CRS form only for `engine.crs_undeclared`. For every other code it returns null: frontends/shell/src/admission/AdmissionPanel.tsx:25-29 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:ce0c8dc4ab97614dbe1a0e4670c6116960e05fb7d251fc8bcbd16852ce0b2e1d
   - `nextFormFamily` carries forward only a family that was already set: frontends/shell/src/admission/AdmissionPanel.tsx:46-49 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:ae7ced2a5c1d9a429a4e367ce6d99f00d6acb5463e68c4551f552ddfe91814c3
   - On a fresh open of a path, that prior family is null: frontends/shell/src/admission/AdmissionPanel.tsx:238-243 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:3dcbe6c39f03e0c15a663656a1237e4a8def0136300ec4593b467f8797893e53
   - `CrsAssertionForm` renders only when `formFamily === "crs"` (AdmissionPanel.tsx:377 at the base). Nothing else in `frontends/shell/src` sends `crsAssertion` outside that form and the e2e test surface.
   - Evidence from runs, cited for what they reported: the E2E row `ABSENTCRS'` reports `.crs-assertion-form present=false` after this refusal. It is at state/drafts/e2e-stale-expectations-reaim-console-alone/console-alone-800.log.txt:23 @ 81d98ed9b24727d9f013f5141ba7a4fc5f70b038 sha256:60d6ea494498e687b40277a92041d883e9b5c57bf875acb144280964cdbdd9e7, and the same line appears in both `m1-alone-801` run logs.
   - Between the base and origin/main, only formatRefusal.test.ts changed under `frontends/shell/src/admission`.
   - KNOWN-LIMITATIONS is about the app. An operator who gets `engine.format_default_contradicted` cannot assert anything there, so the clause does not hold for them.
2. **Even where an assertion can be sent (an SKP client), a northing-first CRS is refused.**
   - A PROJJSON whose axes are (north, east) and not geographic maps to `NorthingEasting`: engine/src/geoparquet.rs:709-719 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:c207659390cb9cf186538d9cfc5473bd4cb15d8e05dbae04d5f13b669829182b
   - An assertion's axis order is then refused unless x comes first, as `engine.axis_order_unsupported`: engine/src/dataset.rs:422-426 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:6ec8b326dafa7d83c0d73d743edcd3f92d36f9d33528fdd9cc8d1289f137bec4
   - Axis directions that are not a planar east/north pair are refused as `engine.axis_order_unestablished` (geoparquet.rs:720-722 at the base).
   - So a file with no `crs` key whose true CRS's own definition lists northing first is refused as `format_default_contradicted`. Asserting that true definition is then refused as `axis_order_unsupported`.
   - The paragraph's existing "Still refused" list names only "a latitude-first CRS that you assert yourself". Asserted northing-first CRSs are refused too, and the list does not name them. Gate 1 missed this.
   - No test at the base asserts the northing-first refusal for an assertion. The code path above is the proof.

**Clauses that hold at the base:**
- **"Also refused: … outside ±180/±90":**
  - Under `FormatDefault`, `convicts` is true. Refusal happens when `inside_crs84_domain` is false (geoparquet.rs:71-73, 613-619; dataset.rs:1206-1223, 1332-1351).
  - Only what the check reads is judged: the bbox, the covering statistics or the first-row-group sample. So "finds" is accurate.
  - Item 22 is the check.
- **"The code is `engine.format_default_contradicted`":** kernel/src/skp.rs:2077-2079 at the base. The E2E logs above show the prefixed code.
- **"because they cannot be longitude and latitude":** this matches the Display at error.rs:330-336.

**Observation for the human, outside this piece's scope:** the engine's own refusal message carries the same promise, "Assert the CRS this file is actually in to open it" (engine/src/error.rs:330-336 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:62fb744a0e95b3df10edd479e2dec8fc715942154c73c2390decd8b4ac33d5c7). The shell gives that message no route.

I propose no wording, because the sentences are the human's.

## Evidence

None new. Gate 1's E-1 is resolved:
- The PR body now says the worker checked each clause, and that gate 1 found C-1.
- Worker report 1 carries the custodian's correction note. Its pin is state/directives/2026-10-11-rulings-205-c1-item-39-pieces-d-e-merge-206.md:8 @ e9beffe99d2c055845f3d4c230e0fd18c5ea5acc. sha256:b1b504a2… recomputes, and e9beffe9 is on main.
- After the human rules on this C-1, the body's "C-1: fixed by your sentences" must state that outcome.

## Documentation (must fix before the merge)

- **D-1.** Worker report 1's correction note has four sentences, and round 12 (d) sets a ceiling of three. The fourth, "Nothing above this note is edited.", is the one that can go.
- Gate 1's D-1 is resolved: the body says the diff changes 1 file and Scope counts 2 with PLAN.yaml.
- Gate 1's D-2 is resolved: the body says `git merge-base origin/main HEAD`.

## Checks (all at the head, in C:/dev/wt/kl2)

1. **The diff dd01801e..ef401e83:**
   - `git diff --numstat` (rc 0) gives `1 1 KNOWN-LIMITATIONS.md`.
   - I rebuilt the expected line: the old line 60, then one space, then the directive's line 7 on main with its three leading spaces stripped, then LF. `cmp` against the new line 60 gave rc 0.
   - The new line's sha256 is 1245553166fb04e84315092d1c199c017217603eeac0e866ce0a88466252b37d.
   - The old line 60's sha256 is 846786d7…, the same as instruction line 9.
   - Line 70 (item 3) has the same hash, db65b22f…, at dd01801e and at ef401e83.
   - KNOWN-LIMITATIONS.md has no CR bytes, and neither does the directive.
2. **The whole diff `origin/main...origin/cut/known-limitations-item-2-on-main-paragraph`:**
   - `--numstat` (rc 0) gives `5 3 KNOWN-LIMITATIONS.md` only. That is 8 lines against 30, in 1 file.
   - The merge-base is 4fd3259a.
3. **Pins:** I extracted all 8 `@ 4fd3259a… sha256:` pins in items 19, 20 and 22 by script and recomputed each with `git show <rev>:<path> | sed -n a,bp | sha256sum`. All 8 PASS. 4fd3259a is on main (`merge-base --is-ancestor` rc 0).
4. **Amendment 1 against the ruling:**
   - Its pin, :6-8 @ e9beffe99d2c… sha256:57f051f3…, recomputes at e9beffe9 and on the current main.
   - Its terms match item 1: keep the paragraph, append the two sentences after one space with the three leading spaces removed, and correct the PR body and the worker report.
5. **The PR body's byte-copied block:** I extracted it from `gh pr view 205 --json` (rc 0). `cmp` against the directive's line 7 without its three spaces gave rc 0, sha256 c8b9f19070882638d7ea4a05187242f55057e8b06478b25afb7f59577ba98f6f. The body has no CR.
6. **Governance scripts:**
   - `node scripts/plan/verify-cites.mjs`: rc 0, PASS, 1685 files, 49 loose advised.
   - `verify-quotes.mjs`: rc 0, PASS, 121 checked, 0 hash-reference errors, 1 advisory.
   - `verify-test-claims.mjs`: rc 0, PASS, 534 claims.
   - `verify.mjs`: rc 0, PASS.
   - `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: rc 0, 457 pass, 0 fail.
7. **CI:** `gh pr checks 205` (rc 0) printed two lines, none pending:
   - every commit is signed off: pass
   - no profile path in the range: pass

   Governance CI did not run for ef401e83. Its `on:` path filters in .github/workflows/governance-ci.yml do not include KNOWN-LIMITATIONS.md. At dd01801e it ran on push, where the fast-forward brought main's paths into the push. The local runs in check 6 cover it.
8. **Low profile:**
   - The title, the body and the three commit messages carry no outside issue or PR reference and no @mention.
   - The only links in the body are the attribution lines.
   - The only `@` in the commits is in the trailers.

The worktree `C:/dev/wt/kl2` is clean (`git status --porcelain` empty) at ef401e830c74fd1e369dfa42fa894a52385ac2da. I made no commits and wrote only to my scratch folder.
