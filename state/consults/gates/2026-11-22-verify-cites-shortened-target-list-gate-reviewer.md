Reviewed: cut/verify-cites-shortened-target at f912819f120a8434d385471b3eedb3d8f92b9274 (the custodian's filing note, 2026-11-22: PR 351's single gate, the reviewer alone, attempt 1; Read 6, Bash 34, Grep 1, SubagentHandback 1, by unique call ids, two Bash calls errored (exit code 4 each), model claude-opus-5-5, from 2026-11-22T11:10:35Z to 2026-11-22T11:35:12Z by its transcript; no call named the main checkout; the report below byte for byte from its hand-back of 15975 bytes, sha256 80970c912b1c48e3d293c3815979fb8b6c6c356e1501c0a78758f882c99ecc44, nothing masked, with this note in its first line and one final newline), gate, reviewer
Verdict: FAIL, PR #351 @ f912819f120a8434d385471b3eedb3d8f92b9274 (cut/verify-cites-shortened-target @ f912819f120a8434d385471b3eedb3d8f92b9274)

One Correctness finding blocks: C1, a false FAIL under `--files`. The fix is one code line plus one test, and it takes a narrow read after it. Three Documentation findings must be fixed before the merge. Everything else on the brief's list holds.

## Check 1: the Out-of-scope line (checked first)
- Commands: `git -C C:/dev/wt/gate-read-vcst diff B...f912819f` written to `<S>/vr-diff.txt` (rc 0). I read the full diff and the whole of `verify-cites.mjs` at the head.
- **ADR:** none touched.
- **Security:** no dependency, no workflow, no new import. `execFileSync` was already imported.
- **Wire:** nothing under protocol/.
- **Guarantee:** the line holds.
  - With `"entries": []`, `shortenedEntries` returns an empty Map, `st` is always undefined and `targetErrors` is `[]`.
  - The scan's result on main is therefore unchanged. `verify:cites` PASS at the head confirms it (check 7).
- The line is true. The piece stays on the five-line form.

## Check 2: the count
- Command: `git -C C:/dev/wt/gate-read-vcst diff --numstat B...f912819f` written to `<S>/vr-numstat.txt` (rc 0).

| File | Added | Deleted |
|---|---|---|
| `scripts/plan/verify-cites-shortened-target.json` | 1 | 0 |
| `scripts/plan/verify-cites.mjs` | 48 | 4 |
| `scripts/plan/verify-cites.test.mjs` | 81 | 0 |

- Total: **134 lines, over exactly the three Scope files** (limit 150).
- `gh pr view 351` lists the same three files (rc 0).
- The 4 deleted lines in `verify-cites.mjs`:
  1. The does-not-catch line `// existence and bounds, not that line N still says what the citation implies); a citation with the`. It is rewritten with the shortened-target clause.
  2. `return { gated, advisory, scanned: files.length, listErrors: legacyListErrors(root) };`
  3. `const { gated, advisory, scanned, listErrors } = runVerifyCites(...)`
  4. `if (!listErrors.length) console.log(`
- None of the four holds a reason string, so no existing reason changed.
- The test file has 0 deletions; its changes are additions after the last existing test. No existing test changed.

## Check 3: the Change line, clause by clause, at the head
- **The list's shape:** holds. The key is `[path, cite]` and the entry carries `commit`. A missing file reads as an empty list (`if (!fs.existsSync(p)) return`).
- **When an entry applies:** holds.
  - `/^[0-9a-f]{40}$/` and the `state/` or `governance/forms/` prefix checks gate the entry.
  - An invalid entry goes to `errors` and is never put in `entries`, so it is not applied. Tests 4 and 5 assert `gated.length 1`.
  - There is one extra error the form does not name, `is not {path, cite, commit}`. It is untested; see Notes.
- **Unpinned cites only:** holds (`const st = cite.pin ? null : ...`).
- **The ancestry check:** holds (`git merge-base --is-ancestor <commit> HEAD`). A missing commit also lands as "not an ancestor".
- **The read at the commit:** holds. It goes through `checkPinned({ ...cite, pin: st.e.commit }, ...)` with the same path list expression as the pin branch, byte for byte. `oldBound` carries through, so the bound is the same.
- **The reason:** holds. The prefix is `shortened-target list scripts/plan/verify-cites-shortened-target.json at <12 hex>: `.
- **The four entry errors:** all present, each under `verify:cites FAIL — N shortened-target list error(s):` with `process.exitCode = 1`, and the PASS line is suppressed:
  - outside the filed-record folders;
  - commit not 40 hex digits (with "not applied");
  - resolves in the tree;
  - matches no unpinned cite.
- **The header:** the SHORTENED TARGET paragraph sits after LEGACY BOUND, and does-not-catch gains the clause. It does **not** say all of ruling item 2: the entry-commit rule from the form's note is missing, so "the commit the rule names" refers to nothing (D1).
- **Legacy list, history check, pinned fallback, existing reasons:** unchanged in the diff. `legacyKeys`, `legacyListErrors`, `checkPinned` and `checkResolved` have no hunks.

## Check 4: edge cases
I probed these with `<S>/vr-probe.mjs` and `<S>/vr-probe2.mjs`, each importing the head's module read-only and building temp repositories (rc 0; logs `<S>/vr-probe.log` and `<S>/vr-probe2.log`).
- **Citing file moved (MOVED.tsv):** handled.
  - An entry naming the current path is read at the commit and passes.
  - An entry naming the old path fails by name with `matches no unpinned cite in its path`. Not disclosed.
- **A token that occurs only pinned:** handled; it fails by name with "matches no unpinned cite".
- **A cite written `./path`:** handled.
  - The recognizer never puts `./` in `raw`.
  - An entry written without `./` applies.
  - An entry written with `./` fails by name, and the cite stays gated.
- **An archived citing file (`state/consults/gates/`):** handled. The failure at the commit goes to advisory with the list's reason, as before. The entry is accepted although it is not needed. Not disclosed (D3).
- **Citing file not tracked:** handled; it fails by name with "matches no unpinned cite".
- **Shallow clone:** handled. The listed cite fails with `the commit is not an ancestor of HEAD`, and `legacyListErrors` already fails every shallow clone.
- **The same token at two lines of one file:** handled. One entry covers both lines; it passed at the commit. Not disclosed (D3).
- **Beyond the brief's list:**
  - **`--files <glob>` that excludes the citing file:** a defect (C1).
  - **Two entries with the same path and cite:** the second silently replaces the first (`Map.set`), and no error is reported. Disclosure only (D3).

## Check 5: the tests on my own exports
- Exports: `git archive` at T and at the head into `<S>/vr-exp-T` and `<S>/vr-exp-H`, then `git init`, `core.longpaths`, add and commit (rc 0 after one tar flag retry and one long-path retry).
- **At T:** `node --test scripts/plan/verify-cites.test.mjs` exit 1, 63 tests, 54 pass, 9 fail (`<S>/vr-testT.log`).
  - All seven new tests fail for their intended reasons:
    - Test 1 is gated with `line 5 exceeds "engine/src/pool.rs" (1 lines)`.
    - Tests 2 and 3 fail on the reason: there is no list name or commit.
    - Tests 4 to 7 throw `TypeError ... reading 'length'` because `targetErrors` is not returned yet.
  - The other two failures are existing tests that `git show 8e90c244…`, i.e. the real repository's history. A history-less export cannot host them. They are not a defect.
- **At the head, export:** exit 1, 61 of 63, the same two history-bound tests failing (`<S>/vr-testH.log`).
- **At the head, in `C:/dev/wt/gate-read-vcst` (with history):** exit 0, **63 of 63** (`<S>/vr-testW.log`). `git status --porcelain` was empty afterwards.

## Check 6: the mutations on the head's export
- Runner: `<S>/vr-mut.mjs`. Each mutation is one anchored replacement that exits 2 unless its anchor occurs exactly once; the runner runs the whole file and restores the original. Every run printed `restored=true`; logs are `<S>/vr-mut-*.log`. All runs exited 0, the export was clean afterwards, and every test file exited 1.
- In the export, every run also shows the two history-bound baseline failures; they are left out below.
- **M1:** red on tests 1, 2, 3 and 6 by name. This matches the RECORDED MUTATION comment.
- **M2 as built** (`false &&` on `checkPinned`'s bound): red on test 2 plus six existing pinned tests:
  - `a_pinned_cite_whose_line_is_past_the_file_end_at_that_commit_fails_by_name`
  - `a_pinned_basename_cite_past_its_resolved_files_end_gives_the_pins_reason`
  - `verify-cites: a pinned line cite into state/CUT-STATE.md whose pin fails stays gated`
  - `verify-cites: a pinned DECISIONS-PENDING.md line cite whose pin fails stays gated`
  - `a_pinned_out_of_range_reason_counts_the_lines_of_a_newline_ended_file`
  - `a_pinned_cite_to_the_line_just_past_the_end_at_its_commit_fails`
- **Does M2 meet the form's M2?** By the letter, yes: the bound at the entry's commit is dropped (along with every pin's bound), and test 2 fails by name. My two local mutations are the stronger evidence:
  - M2L1 passes `startL: 1, endL: 1` into the listed call only.
  - M2L2 changes `if (sr.ok || /exceeds/.test(sr.reason)) continue;`.
  - Each turns **only test 2** red, so test 2 kills a bound drop confined to listed cites.
- **M3 to M7:** each turns only its own test red (3, 4, 5, 6 and 7 respectively), as recorded.

## Check 7: CI's checks at the head, in `C:/dev/wt/gate-read-vcst`
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: run inside a shared hold, exit 0, **622 of 622** (`<S>/vr-ci-test.log`).
  - Hold lines: `MACHINE_HOLD shared project=<m> ... also=<m>` and `MACHINE_RELEASED project=<m> ...` (`<S>/vr-hold1.log`).
- `node scripts/plan/verify-cites.mjs`: exit 0, PASS across 3564 files, 204 loose advised.
- `node scripts/plan/verify-quotes.mjs`: exit 0, PASS (159 checked, 128 verified, 30 baselined).
- `node scripts/plan/verify-test-claims.mjs`: exit 0, PASS (895 claimed).
- `node scripts/plan/verify.mjs --offline`: exit 0, `verify:plan PASS`.
- `git status --porcelain`: empty after every run.
- `gh pr checks 351` (rc 0): all 8 rows pass, matching the custodian's CI line.

## Check 8: the worker's report against its logs
- T: `vcst-t.log` shows 56/63 with the seven new tests failing. It matches.
- S's three runs match: `vcst-s1.log` 63/63, `vcst-s2.log` 622/622, `vcst-s3.log` PASS across 3564 files.
- Mutation logs:
  - `vcst-m1.log` shows 4 red.
  - `vcst-m2.log` shows 7 red (test 2 plus the six above).
  - `vcst-m3.log` to `vcst-m7.log` show 1 red each, by the named test.
- The numstat matches mine.
- Writes outside `<S>`: the worker's scripts (`vcst-edit.mjs`, `vcst-mut.mjs`, `vcst-cm.mjs`) write only the worktree file. Apart from the recorded `$TMP` script, I found nothing else written outside `<S>` beyond the tests' own temporary folders.
- One wrong statement: "I could not drop the bound in new-code only". M2L1 and M2L2 do exactly that (Evidence note; it does not block).

## Correctness (blocking)
**C1. A listed entry whose citing file falls outside a `--files` glob is reported as `matches no unpinned cite in its path`, with exit 1.** The entry may well match a cite; its file was simply not scanned.
- Probe `files_glob_excludes_citing_file`: an entry for `state/note.md` under `filesGlob: 'docs/**'` gives `targetErrors: [... "matches no unpinned cite in its path"]`.
- `--files` is the documented override (header: "DEFAULT FILE SET (override with `--files <glob>`)"), and audits use it (e.g. `--files 'docs/**/*.md'` in a filed consult).
- It is latent at this head because the list is empty. It becomes reachable as soon as item 4 adds the cancel branch's ten entries.
- **Proposed correction to a code line (it takes a narrow read after it, ADV-2026-11-22-05 item 4):** in `verify-cites.mjs`, the line `if (!matched) targetErrors.push(` becomes `if (!matched && (!filesGlob || files.includes(e.path))) targetErrors.push(`.
- I tried it on my export:
  - The glob probe gives `targetErrors: []`.
  - The untracked-file and pinned-only cases still fail by name.
  - The test file shows 61/63, i.e. only the two history-bound baseline tests fail (`<S>/vr-probe-fix.log`, `<S>/vr-testH-fix.log`).
- **Proposed test with its mutation:**
  - Give `shortened` a `glob` parameter, passed as `filesGlob` (an edit to an already-added line, so it costs nothing in the count).
  - Add `a_shortened_target_entry_outside_the_files_glob_is_not_reported_as_unmatched`, asserting `[r.gated, r.targetErrors]` deep-equals `[[], []]` with `glob: 'docs/**'`.
  - M8: the glob condition removed, recorded the same way as M1 to M7.
  - About 5 to 6 added lines.
- **Budget:** 134 plus 6 for the test, plus 2 each for D2 and D3's legacy-line edit, comes to about 144 if D1 and the D3 disclosures are appended to lines this PR already adds. Over 150 takes both gates (form, item 3).

## Evidence
- No blocking finding. M2 as built meets the form's letter, and my local mutation shows test 2 kills a listed-only bound drop.
- The worker's "could not drop the bound in new-code only" is wrong, as noted under check 8. The RECORDED MUTATION (M2) comment is true as written.

## Documentation (must-fix before the merge; none of this is the human's wording; worker-written comments)

**D1. The header lacks the entry-commit rule** (ruling item 2, fifth bullet, and "The script's header and its 'does not catch' paragraph say all of this"). The does-not-catch clause "not that it is the commit the rule names" points at a rule the header never states.
- Append to the SHORTENED TARGET paragraph, after `(targetErrors).`:
  `An entry's commit is the commit that filed the citing line, where the cite holds there; where it does not, it is the newest commit on HEAD's first-parent history at which the cite holds, the first parent of the first-parent commit that shortened the cited file below the cited line (the form's rule).`
- In does-not-catch, replace `not that it is the commit the rule names` with `not that it is the commit the rule above names`.
- Clause check against the code:
  - It is a rule for whoever writes the entries. The only code checks are `merge-base --is-ancestor` and `checkPinned`, and the existing does-not-catch clause already says the scan does not check which commit an entry names. That is true: no code compares the entry's commit with the filing or shortening commit.

**D2. The doc comment above `runVerifyCites`** (`Runs the scan. Returns { gated, advisory, scanned, listErrors }.`) is now stale.
- Replace with `Runs the scan. Returns { gated, advisory, scanned, listErrors, targetErrors }.`
- Clause check: the return statement returns exactly those five fields.

**D3. The does-not-catch paragraph reads "a list entry no longer needed is not reported; a change to the list is checked against its history only once committed".** With two lists this is ambiguous, and it is false for the shortened list.
- Replace with `a legacy-bound list entry no longer needed is not reported; a change to the legacy-bound list is checked against its history only once committed`.
- Append to the shortened-target clause already added in does-not-catch:
  `; the shortened-target list has no history check; an entry for a cite in an archived folder is accepted though that cite is advisory anyway; one entry covers every occurrence of its token in its citing file; and a second entry for the same file and token replaces the first, unreported`
- Clause check against the code:
  - No history function reads `SHORT_LIST`.
  - Archived: the probe gave advisory and no target error.
  - Two occurrences: the probe gave one entry, passing.
  - Duplicate entries: `Map.set` overwrites; the probe showed the second commit used and no error.
- If C1 is fixed as proposed, also add `; under --files, an entry whose citing file the glob excludes is not checked for a match`.

## Notes
- The untested `is not {path, cite, commit}` error is a fifth entry error the form does not name. It is reasonable; the closing amendment could name it. My probe `bad_shape_entry` shows it firing for `cite: 5` and for `null`.
- A listed *loose* cite that matches nothing in the tree and fails at its commit is silently skipped, as an unlisted loose cite is. No filed cite of that kind can have failed the scan, so I do not rate it a defect.
- Tests 4 to 7 fail first by `TypeError`, not by assertion. That is acceptable for a missing return field.
- Nothing I started is still running. All my files are under `<S>`, named `vr-*`.

Files:
- `C:/dev/wt/gate-read-vcst/scripts/plan/verify-cites.mjs`
- `C:/dev/wt/gate-read-vcst/scripts/plan/verify-cites.test.mjs`
- `C:/dev/wt/gate-read-vcst/governance/forms/scripts/VERIFY-CITES-SHORTENED-TARGET-LIST-PREREGISTRATION.md`
- `<S>/vr-probe.log`, `<S>/vr-probe2.log`, `<S>/vr-mut-*.log`, `<S>/vr-probe-fix.log`, `<S>/vr-ci-test.log`
