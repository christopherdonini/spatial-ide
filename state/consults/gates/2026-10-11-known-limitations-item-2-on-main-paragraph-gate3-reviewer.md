# PR #205 gate 3 — reviewer
Reviewed: cut/known-limitations-item-2-on-main-paragraph @ d2294623916745d97e5d46cd08b9b5c46934526b

**Verdict: PASS.** The line 60 replacement is the directive's line 7 byte for byte, and every clause of the two new sentences holds at base 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23. The first appended sentence also holds. There is one edge route the human should know about: the same path is picked again after the file changed on disk (O-1 below). I do not rate it as making the sentence untrue, and I propose no wording. Scope, pins, governance and CI are green. Gate 2's D-1 is resolved. There is one Documentation finding (D-1), to be fixed before the merge. The worktree is clean at the head.

## Correctness

No blocking finding. I checked each clause of KNOWN-LIMITATIONS.md:60 @ d2294623916745d97e5d46cd08b9b5c46934526b against the base. That line's sha256 is 32793286a05126e0fca6011c8ba0b220688605b1a1aeb8c5b1b6ae7accb0d58a, and the spans below are sub-line spans of it.

- **"The code is `engine.format_default_contradicted`."**: holds.
  - The kernel maps the variant to the name `format_default_contradicted` (kernel/src/skp.rs:2077-2079 at the base).
  - That name gets the prefix `engine.` (kernel/src/skp.rs:2200 at the base).
- **"The app does not yet offer a CRS assertion after this refusal"**: holds for every route except O-1.
  - `formFamilyForCode` opens a form only for `engine.crs_undeclared` and `engine.identity_unusable`: frontends/shell/src/admission/AdmissionPanel.tsx:25-29 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:ce0c8dc4ab97614dbe1a0e4670c6116960e05fb7d251fc8bcbd16852ce0b2e1d
  - `nextFormFamily` carries any earlier family forward: frontends/shell/src/admission/AdmissionPanel.tsx:46-49 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:ae7ced2a5c1d9a429a4e367ce6d99f00d6acb5463e68c4551f552ddfe91814c3
  - `CrsAssertionForm` renders only when `formFamily === "crs"` (AdmissionPanel.tsx:385-391 at the base).
  - Every product caller of `admitPath` is in AdmissionPanel.tsx at lines 295, 315, 389 and 404 at the base. Only line 389 (the CRS form) carries an assertion. Line 315 is the `openPath` hook, which is registered only under `isInstrumentedBuild()` (DEV or VITE_MEASURE_BUILD=1). The console does not issue opens.
  - The engine never raises this refusal once an assertion is supplied:
    - An assertion over a format-default file makes `admissible` None, so the assertion is admitted (engine/src/dataset.rs:411-414 at the base).
    - Its provenance is `Asserted` (dataset.rs:443-448).
    - For `Asserted`, `sanity_check` sets `rule` to None and returns NotChecked before `convicts` is evaluated (dataset.rs:1206-1217).
    - So no resubmit from a CRS form can produce this code. The family carried with it can only be one set earlier on the same path, which leads to O-1.
- **"so on `main` such a file cannot be opened in the app."**: holds.
  - The refusal is raised whenever `convicts` is true and `inside_crs84_domain` is false (dataset.rs:1223 and 1338-1351; geoparquet.rs:613-619 at the base).
  - The only remedy is an assertion, and the app does not route one here (above).
  - Re-picking the same unchanged file gives the same refusal with no form.
- **The first appended sentence** ("Also refused: … because they cannot be longitude and latitude.") still holds:
  - The default applies only to `crs` key Absent with a pinned version, `PINNED_SPEC_VERSIONS` = ["1.0.0", "1.1.0"] (geoparquet.rs:37, 509 and 560-571).
  - The bounds are 180.0 and 90.0 (geoparquet.rs:71 and 73).
  - The Display reads "A coordinate outside ±180/±90 is not longitude/latitude on WGS84" (engine/src/error.rs:330-336 at the base).
  - Item 22 is the sanity check (KNOWN-LIMITATIONS.md:257).
- The rest of the paragraph is byte-identical to ef401e83 (prefix compared by script below).

**O-1 (for the human; not blocking).** The panel can show the CRS form after `engine.format_default_contradicted` in one case: the same path is picked again while a CRS-family refusal for it is still showing, and the file at that path has changed on disk in between.
- `runAdmitPath` keeps `kind: "refused"` when the same path is opened again: frontends/shell/src/admission/AdmissionPanel.tsx:205-209 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:7f5c35f4892c8d4fa84064ecf8f771e6df6a2ca6eab71bc9c02de1b274291988
- `handlePick` goes through that same path for a plain open: AdmissionPanel.tsx:290-296 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:03e18920860c94be49a0b6d145827aedc02ead71394f884ce594a64ac825d416
- The earlier family is carried when `prev.path === path`: AdmissionPanel.tsx:238 @ 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23 sha256:833e1a3bb8165b411b68d5a0dd42d12d4d64b79a0ab6add6b1620d7c5ab31b02
- `nextFormFamily("crs", "engine.format_default_contradicted")` returns `"crs"` (lines 46-49 above).

Example: a file with no `crs` key and an unpinned version is refused as `engine.crs_undeclared`, and the CRS form shows. Its version is then rewritten to 1.1.0 on disk, and the operator clicks Open GeoParquet… and picks the same path. The new refusal is format_default_contradicted, the CRS form stays, and an x-first assertion would open the file.
- An unchanged file never takes this route, because a file refused this way was never refused as crs_undeclared.
- No test at the base asserts the carry for this code. AdmissionPanel.test.ts:65-66 asserts it only for the two axis-order codes. The code path above is the proof.
- The sentence describes the app's response to this refusal, and this route is the carry-forward of an earlier refusal. So I count the clause as holding.
- I report the route, as the ruling asks, and do not reword the sentence. The S1 node in the human's item 2 would subsume it.

**Carried from gate 2, unchanged:** an asserted northing-first CRS is still refused as `engine.axis_order_unsupported` (dataset.rs:422-426 at the base). The paragraph's "Still refused" list does not name it. The human's item 2 routes this to the CRS-form node's open items, and this piece leaves it alone.

## Evidence

None.

## Documentation (must fix before the merge)

- **D-1.** Amendment 2 item 1 of KNOWN-LIMITATIONS-ITEM-2-ON-MAIN-PREREGISTRATION.md refers to the directive as "lines 6 to 8" with no rev or hash. Commit df6d39a0, which adds Amendment 2, also creates that directive. That is a line reference into a file the same commit edits, which round 14's root-cause rule forbids.
  - The pin is now available, since df6d39a0 is on main: state/directives/2026-10-11-rulings-205-clause-crs-form-node-207-sentence.md:6-8 @ df6d39a065a3e1e7b8049801cdd00a7d98de0201 sha256:92dfbcf4dced28377ca39bed9fc4198ba4819190e916b008f6b99908c8b438f2
  - It recomputes identically on origin/main.
  - The amendment says "Nothing above is edited", so the fix is an appended correction of one sentence, not an edit in place.
- **Gate 2's D-1 is resolved.** Worker report 1's correction note now has three sentences. Commit 4a3f711e removed exactly " Nothing above this note is edited." and nothing else (a script compared the old and new lines: a 740-byte common prefix, and only that tail differs).
- Its pin, state/directives/2026-10-11-rulings-205-c1-item-39-pieces-d-e-merge-206.md:8 @ e9beffe99d2c055845f3d4c230e0fd18c5ea5acc sha256:b1b504a2…, recomputes, and e9beffe9 is on main (`merge-base --is-ancestor` rc 0).

## Checks (in C:/dev/wt/kl2 at d2294623…, after `git fetch origin`)

1. **Head:** `git rev-parse HEAD` and `origin/cut/known-limitations-item-2-on-main-paragraph` both give d2294623916745d97e5d46cd08b9b5c46934526b (rc 0). `gh pr view 205` reports the same headRefOid, OPEN, not draft (rc 0).
2. **Diff ef401e83..d2294623:**
   - `git diff --numstat` (rc 0) gives `1 1 KNOWN-LIMITATIONS.md`, with the single hunk `@@ -60 +60 @@`.
   - A node script:
     - took old line 60 and the directive's line 7 from origin/main;
     - checked that the line starts with exactly three spaces, and removed them;
     - checked that `The code is` and `opens it.` each occur once in the old line, in that order;
     - replaced that span with the rest of line 7;
     - compared the result with the new line 60: equal, true.
   - Old line sha256: 1245553166fb04e84315092d1c199c017217603eeac0e866ce0a88466252b37d. New line sha256: 32793286a05126e0fca6011c8ba0b220688605b1a1aeb8c5b1b6ae7accb0d58a. Both match worker report 3.
   - Neither the new line nor directive line 7 has a CR byte (grep -c CR gives 0 for both).
3. **Whole diff `origin/main...origin/cut/known-limitations-item-2-on-main-paragraph`:**
   - `--numstat` (rc 0) gives `5 3 KNOWN-LIMITATIONS.md` only: 8 lines against the budget of 30, in 1 file.
   - The merge-base is 4fd3259a3e274dbc1f0a9c3ad72d168096a20e23.
   - The branch has 4 commits (a2caf2a9, dd01801e, ef401e83, d2294623).
4. **Pins:**
   - A script extracted every `path:line @ rev sha256:` pin in KNOWN-LIMITATIONS.md (20 in all) and recomputed each with `git show rev:path | sed -n a,bp | sha256sum`: pass=20 fail=0.
   - Eight of them are at 4fd3259a: dataset.rs 319-327, 1166-1217, 1206-1223, 1352-1362, 1646-1686; error.rs 377-382, 383-388; skp.rs 2092-2095. All 8 pass.
   - 4fd3259a is an ancestor of origin/main (rc 0).
5. **Governance scripts at the head:**
   - `node scripts/plan/verify-cites.mjs`: rc 0, PASS, 1685 files, 49 loose advised.
   - `node scripts/plan/verify-quotes.mjs`: rc 0, PASS, 121 checked, 0 hash-reference errors, 1 advisory.
   - `node scripts/plan/verify-test-claims.mjs`: rc 0, PASS, 534 claims.
   - `node scripts/plan/verify.mjs`: rc 0, verify:plan PASS.
   - `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: rc 0, 457 pass, 0 fail.
6. **CI:** `gh pr checks 205` (rc 0) printed two lines, none pending:
   - `every commit is signed off	pass	6s	https://github.com/christopherdonini/spatial-ide/actions/runs/38129924936/job/114441950644`
   - `no profile path in the range	pass	10s	https://github.com/christopherdonini/spatial-ide/actions/runs/38129924969/job/114441950598`
   - `gh run view` (rc 0) shows both runs at headSha d2294623… with conclusion success.
   - Governance CI did not run, because its path filters do not include KNOWN-LIMITATIONS.md (as at gate 2). Check 5 covers it locally.
7. **PLAN node:** generation is 3 on main, matching Amendment 2 item 4.
8. **Low profile** (state/directives/2026-10-08-low-profile-on-github.md):
   - The title and the four commit messages carry no outside issue or PR reference, no outside link and no @mention.
   - The only `#` reference is this project's own "PR #205". The only `@` is in the Co-Authored-By and Signed-off-by trailers.
9. **Worktree:** `git status --porcelain` is empty at d2294623916745d97e5d46cd08b9b5c46934526b. I made no commits and wrote only to my scratch folder.
