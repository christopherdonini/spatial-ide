Reviewed: PR #270 at 494cea7b88cd0f157cb9b74d5bbf0cee3ed605a2, gate 1, architect (cut/governance-f-tidy-repository-in-place @ 494cea7b88cd0f157cb9b74d5bbf0cee3ed605a2)
Verdict: FAIL

The gate fails on one Correctness finding, C1. C2 edited the generated ADR index in `docs/README.md` by hand, so the shell's `npm run verify` cannot pass. Everything else is either evidence owed before the click or a Documentation finding that is fixed in this PR with no re-gate.

I have no shell, so this report carries no sha256. I read every file at C2 in the worktree C:/dev/wt/pf, whose HEAD, local branch ref and origin branch ref all read 494cea7b. The form, the rulings and the reports I read on main. Line cites below are at C2 unless I say otherwise.

## Correctness

**C1. C2 hand-edits the generated ADR index in `docs/README.md`, so `verify:adr-index` fails and the shell's `npm run verify` goes red.**
- Inside the `adr-index` markers, C2 changed the path in the rows for ADR-016, 022, 026, 027, 032, 033, 034 and 035 (`docs/README.md:54`, `:60`, `:64`, `:65`, `:69`, `:70`, `:71`, `:72`) from `DECISIONS-PENDING.md` to `governance/DECISIONS-PENDING.md`.
- Each of those cells is generated as a verbatim copy of the ADR's own Status line (`frontends/shell/scripts/adrIndex.mjs:10-13`). The ADRs still say `DECISIONS-PENDING.md`, and rightly so, because accepted ADRs are immutable. For example, `docs/adr/ADR-016-stable-feature-identity-admission.md:4` and `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:3` both still carry the old name.
- `checkIndex` compares the rows byte for byte and fails on any difference (`adrIndex.mjs:289-332`).
- `verify:adr-index` is the fourth step of the shell's `npm run verify` (`frontends/shell/package.json:17`, `:23`). That suite is required by section 9, and product-ci-shell runs it on this PR (`.github/workflows/product-ci-shell.yml:203-212`).
- This trips section 8 item 7 and makes a section 9 suite red. The build report shows only `citationIntegrity.test.mjs` from that suite was run, so nothing caught it.
- **Fix.** Restore those eight rows to their bytes at P, which is the same as running `npm run adr-index` in `frontends/shell`. Keep the path-only edits in the hand-written narrative at `docs/README.md:27-28`. The table's old names resolve through MOVED.tsv, under the human's OPEN-7 (A).
- **Proof owed.** `npm run verify:adr-index` PASS and the full `npm run verify` green at the new head. A re-gate of that one change is enough.

## Evidence (owed before the click; none of it fails the gate by itself)

- **E1. The Guardian tests have not been run.** The build report says the worker could not issue `claude plugin test`, and no workflow runs them. Section 9's suites and the human's OPEN-9 (B) require them to run as they are. The custodian or the human must run them and record the result.
- **E2. The whole of section 9's suites must be green at the final head:** governance-ci including its two new steps, the `node --test` sets, the shell's `npm run verify`, and product-ci-shell, -viewer and -rust. At C2 the shell suite is red because of C1.
- **E3. Main has moved past P.** Main is at a1ed4c54 and P is 51a2cbad. Section 9 and Amendment 2 require that before the click main is merged into the branch, rule R and `rewrite-gates` are re-run, and the section 5 proof is redone.

## Documentation (must-fix in this PR)

None of these sentences is the human's wording except where I say so.

**D1. `governance/README.md:19` says the forms are filed by "the code they were written about".** That is untrue: rule R files a form by the folder it sat in, not by its subject (the form's section 2.1). The worker's words; apply mine with no re-gate. My words:
"- [`forms/`](forms/): the preregistration forms, one folder for each top-level folder the forms sat in before the move, and `root/` for those that sat at the repository root."
- Clause check: rule R uses the first path segment (section 2.1), and MOVED.tsv's 188 rows confirm it.

**D2. `governance/README.md:12` says MOVED.tsv covers "every file this folder took in".** But row 145 of MOVED.tsv moves `run-cold-open.ps1` to `scripts/run-cold-open.ps1`, outside this folder. The worker's words. My words:
"- [`MOVED.tsv`](MOVED.tsv): the old path, the new path and the move commit of every file a moves-only commit relocated: the files this folder took in, and `scripts/run-cold-open.ps1`."
- Clause check: 188 rows, 187 of them under `governance/` and 1 at `scripts/run-cold-open.ps1`.

**D3. `governance/README.md:29` leaves out `verify-test-claims`,** which now resolves through the map under Amendment 4 (`scripts/plan/verify-test-claims.mjs:100`, `:288-305`). The worker's words. My words:
"- A record that names a file by its old path is not edited. `scripts/plan/verify-cites.mjs`, `scripts/plan/verify-quotes.mjs`, `scripts/plan/verify-test-claims.mjs`, `scripts/plan/verify.mjs` and `scripts/plan/site.mjs` read the old path through `MOVED.tsv` and open the file where it is now."
- Clause check: each of the five scripts imports `movedMap.mjs` (`verify-cites.mjs:101`, `verify-quotes.mjs:138`, `verify-test-claims.mjs:100`, `verify.mjs:26`, `site.mjs:24`).

**D4. `.claude/agents/worker.md:15` still points the worker to `AI_DEVELOPMENT.md` at the root.** It is not backticked, so the table's "backticked path tokens only" rule skipped it. It directs an author to open a file, so the human's OPEN-7 (A), widened, covers it; the change is path only and outside any quoted span. Change `AI_DEVELOPMENT.md` there to `governance/AI_DEVELOPMENT.md`. I searched the other agent definitions and found no other unquoted root path that points to a file.

**D5. Two `docs/` sentences say a scheduled experiments form moves to the module directory:** `docs/experiments/README.md:5-6` and `docs/README.md:29`. After this piece, forms-layout fails a form placed there by name. Leaving `docs/` would also change the file's licence (`LICENSES/README.md:22-23`), which is a red line. Editing these sentences is outside the human's OPEN-7 list and section 2.2's table (section 8 item 3), so this goes to the human. The human can widen OPEN-7 or carry it to a follow-up piece. Proposed words, mine, for `docs/experiments/README.md:5-6`:
"Once the work is scheduled, its preregistration is written under `governance/forms/<the module's folder>/` (`governance/README.md`); this document stays here, append-only, and is no longer listed as unscheduled."
- Clause check: rule R and forms-layout (form sections 2.1 and 2.5), and the human's OPEN-1 (A), which keeps the experiments form in `docs/`.
- Not checked: whether the precedent cited there, `protocol/transport-bakeoff/README.md`, still reads the same way.

**D6. Amendment 2 cites the human's directive as "(line 10)", "(line 12)" and "(line 8)" with no `@ <commit> sha256`.** Round 14's pin rule asks for the pinned form. The three quoted spans do match the directive byte for byte (lines 10, 12 and 8 read). Under the record cap the fix is the pinned references, carried in the closing amendment, with no correction round.

### The README, for the human (the words are the human's to approve; the proposed words are mine)

- **R1. `README.md:33-34` says "nothing on this page is claimed for it".** But the map at `:43-68` describes main's tree. Proposed: "`main` is ahead of v0.1.0, and no behaviour on this page is claimed for it."
  - Clause check: the map describes files; the behaviour clauses, Install and Local-first describe v0.1.0 (governance/RELEASE-0.1.md Amendments 15, 16 and 18).
- **R2. `README.md:60` reads as a complete list of `scripts/` and leaves things out:** `scripts/run-cold-open.ps1`, which this piece moves there, `check-ported-notices.mjs` and the two `summarize-*.mjs`. Proposed: "`scripts/` — the plan's checks, the session hooks, the evidence tools, the licence and notice audits, and measurement helpers."
  - Clause check: the files under `scripts/`, `scripts/plan/`, `scripts/hooks/` and `scripts/evidence/` at C2.
- **R3. `README.md:54-55` says `governance/forms/` "holds the preregistration forms",** but two forms stay in `docs/` and the drafts in `state/`. Proposed: after "holds the preregistration forms", insert "(the two under `docs/` and the drafts under `state/` excepted)".

## Checks 1 to 5

**1. Section 1's claims.**
- **M.** MOVED.tsv has 188 rows, every one naming a8ae51d9 as its commit. Every new path is under `governance/` or is `scripts/run-cold-open.ps1`. No row touches `docs/`, and the file has no CR. The custodian's filing note and the build report give 188 R100 lines, 0 insertions and 0 deletions; the reviewer runs the R100 script itself.
- **History.** The build report has check 3, as Amendment 3 corrected it, passing on all 188 rows.
- **Same results.** All of section 5's comparisons are equal (the build report's table), but the shell `npm run verify` is red (C1) and the Guardian tests are unrun (E1).
- **Counts.** Root entries go from 59 to 32, and code-folder Markdown from 206 to 46 (160 fewer, as Amendment 3 says). Two forms remain outside `governance/forms/` and `state/`, both on OPEN-1's list.
- **What it may not claim.** No such claim found. There is no performance figure; verify-cites' wall time (about 3.9 s to about 23 s) is recorded as a fact against the 15-minute ceiling in section 7. There is no wire, ADR, licence-layer, history or visibility change. No product source changed; the only edit under `frontends/shell` is `citationIntegrity.test.mjs`. Nothing claims that GitHub's web history follows the renames.

**2. The constitution and the records.**
- No accepted ADR was edited: there is no `governance/` token in `docs/adr/`, and the ADR Status lines keep the old names.
- `docs/01_Principles.md` has no edit token. That was checked by search; I could not diff it.
- The edits to `docs/PREREGISTRATION-TEMPLATE.md` (lines 5, 8, 12, 24, 29, 38, 64 and 146) are path only.
- In `docs/README.md`, the narrative lines `:27-28` are path only. The edits inside the generated block are C1.
- The licence layers are unchanged (`LICENSES/README.md:22-23`, `:27`), and no row moves a file into or out of `docs/`.
- Agent definitions: `architect.md` has 6 tokens changed on lines 11, 15, 17 and 19, and `reviewer.md` 6 tokens on lines 25, 29, 31 and 33. All are backticked, none is inside a quoted span, and each matches main's line. The build report calls this "8 backticked path tokens"; it is 8 lines and 12 tokens. That is a filed record, so this is noted only.
- `CLAUDE.md` has path-only edits on lines 8, 34 and 36, plus one new `governance/` bullet at line 22.
- `CONTRIBUTING.md` (lines 56 and 118) and the issue template (line 10) are path only.
- The dated pointer is appended at `governance/AUTONOMY.md:711`, after main's last line 709.
- `governance/README.md`'s entries are true of each file's own opening, apart from D1 to D3.

**3. Section 2.2, the settlement and Amendments 1 to 5.**
- **Amendment 1 (class 2).** It matches the phase 1 report and the delta rows (the build report's M section).
- **Amendment 2 (class 5).** All three quotes are byte-true. On the cite form, see D6.
- **Amendment 3 (class 2).** The corrected check 3 is section 1's own claim, stated on both sides of M, and does not weaken it. The first-stop report's diagnostic shows --follow equality on all 188 rows. The second unpushed M, 2003f8e2, was also discarded; the build report records it.
- **Amendment 4 (class 9).** It has the template's class 9 shape: "scope addition" in its first line, the directive cited by path, and section 2, section 4 (T18 and T19, each with one mutation), section 5 and sections 7 to 9 declared. It was declared before any code: the second-stop report says the logic was not edited, and the code first appears at C2, after P. Both tests exist at `verify-test-claims.test.mjs:1862` and `:1877`, and the build report records both mutations observed with their commit. C2's size is 45 files and 1,542 lines, within section 7, so it is not class 8.
- **Amendment 5 (class 2).** All three readings are true of the second-stop report's readings 1 to 3 and of the build report.
- **The settlement.** It is consistent. The check under Rule (00) has to be re-run (check 5).

**4. The README.**
- The new `README.md` matches the draft (draft lines 32-152) line for line, by reading.
- The kept sections at C2 match main's lines by reading: vision `1-10`, limits pointer `36-41`, Install `70-84`, First five minutes `86-90`, Local-first `92-105`, License `107-116`, Contributing `118-121`. The build report says they were also byte-checked by script.
- Each clause of What works today is supported by Amendments 15, 16, 17, 18 and 21 of `governance/RELEASE-0.1.md` (the filter not being published is Amendment 21's corrected reading), and nothing is claimed for main.
- The map is true of the tree at C2, apart from R2 and R3.
- The release step is in `governance/RELEASE-DAY-CHECKLIST.md:15`.

**5. Rule (00) and timing.** This could not be run: I have no `gh`. Before the click, `gh pr diff --name-only` for #269 (open, closed for the click), for any other open PR, and for `cut/b2-piece-1c-save-and-reopen` and `cut/port-2-macos-l1-and-app-dirs` must be compared with C2's file list. `citationIntegrity.test.mjs` must have no other piece in flight. Then E3 applies. The PLAN node carries `merge: merge-commit` (`governance/PLAN.yaml:6177`). The merge must be a merge commit, so that a8ae51d9 stays reachable from main.

Not run by me (no shell): sha256, the git diffs of M and C2, `gh`, `npm`, `node`.
