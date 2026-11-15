Reviewed: PR #307 at 9e0d4b08f17ef07033af4ea35b4f512fc7c5a4f6 (the custodian's filing note, 2026-11-12: gate 1, attempt 2 completed, the reviewer, after the architect, whose report it was given from scratch by sha256, PLAN node b2-piece-1c-save-and-reopen, step 1; over R2 and R3 together by Amendment 22 item 5; below, the hand-back byte-identical, one final newline added)
Reviewed: PR #307 at 9e0d4b08f17ef07033af4ea35b4f512fc7c5a4f6 (base e3fb4a97), gate 1 attempt 2 completed, reviewer · cut/b2-piece-1c-save-and-reopen @ 9e0d4b08f17ef07033af4ea35b4f512fc7c5a4f6
Verdict: PASS WITH NOTES (WORDS-ONLY)

The code's Correctness and Evidence are closed: every mutation was killed, fmt is clean, clippy adds no new warning, and the suites pass. The two blocking findings are both about the words of a sentence, so each comes with replacement words and a clause check. Neither sentence is the human's wording.

## Findings

### Correctness (blocking; words only)

**C-1. KNOWN-LIMITATIONS item 63's headline and first two body sentences are untrue for a save made before any step.** I concur with the architect's C-6 and add one clause.
- **Requirement:** an untrue claim of a limit is Correctness under proportional gates.
- **Evidence:**
  - When the first save comes before any step, no record exists yet (the record is created only by `record_step`, `session_history.rs:249`). The second open's first step then creates an unheld record, and its save adopts it and writes the mark.
  - A second open saved into a folder that already holds `project.spatial` is refused with FolderHoldsProject (`kernel/src/project/mod.rs:263-265`), so "saved to a folder" also overstates.
  - The text is R3-2's DRAFT (`KNOWN-LIMITATIONS.md:506-508` at H). It is not the human's wording, so the worker applies the words with no re-gate and the PR body lists them.
- **Closure:** these words.
  - Headline: "**A file opened again in the same run and saved to another folder can get a project file and no `saved-here` mark in the session history.**"
  - Body, first two sentences: "The session history keeps one record for a file and the claims it was admitted under, from the first filter or style change recorded on it, and a save of an open dataset moves that record under the save's project when no project holds it yet. If a save has moved the record, and that dataset is closed and the same file is opened again in the same run (the same path, admitted under the same claims), and the second open is saved to a folder that holds no `project.spatial`, the save makes another project and writes its `project.spatial`."
- **Clause check against the code at H:**
  1. "can get … no `saved-here` mark": K-S15's assertion at `kernel/tests/project_save_skp.rs:427` (B's reply is Withheld). "can" because the case before any step ends Written.
  2. "one record for a file and the claims it was admitted under": a record is matched by path and `same_claims` (`session_history.rs:244-252`, `:423-427`).
  3. "from the first filter or style change recorded on it": `create` is reached only from `record_step` (`:249`), and StepIntent has only FilterApply and StyleSet (`protocol/skp/src/v0/commands.rs:531-536`).
  4. "moves … when no project holds it yet": `adopt_project` (`:279-293`).
  5. "makes another project": `saved` is keyed by catalog name (`mod.rs:244-253`) and `open_dataset` mints a new handle at each open, so the second open's first save is a first save.
  6. "a folder that holds no `project.spatial`": `mod.rs:263-265`.
  - The rest of item 63 holds in the moved-record case.
  - Ordinary use reaches this, so it blocks.

### Evidence (blocking; words only)

**E-1. The header of `kernel/tests/no_generation_in_persisted_artifacts.rs` claims a proof the file does not make.**
- **Requirement:** a claim of a guarantee the evidence does not support is never documentation-only.
- **Evidence:**
  - Lines 10-12 at H, byte-copied: "This file" / "enumerates, from the code rather than from memory, every artifact this tree can write to disk or" / "hand to an operator to read later, and proves each carries neither the word nor a value."
  - This piece's `Projects::save` writes the machine store's `locations.json` and `folders.json` through `write_machine_file`.
  - G3 (`:922`) reads only `folder.join(PROJECT_FILE_NAME)`. The file's only `locations.json` hits (`:798`, `:865`, `:892`) are the session record's. No test in the file scans the machine store.
  - **Class:** the architect put this under Documentation (D-13, which covers lines 55-59 and 795-796). I class it Evidence, because "proves each" is a guarantee claim.
  - Not the human's wording.
- **Closure:** apply the architect's D-13 words for lines 55-59 and 795-796, and replace the sentence at lines 10-12 with:
  - "This file enumerates, from the code rather than from memory, every artifact this tree can write to disk or hand to an operator to read later, and proves each family below carries neither the word nor a value; the machine store's `locations.json` and `folders.json`, which `Projects::save` writes, are named below and are not scanned."
  - The alternative closure is a test that scans those two files.
- **Clause check:**
  - "each family below": the scans at `:232`, `:289`, `:346`, `:425`, `:486`, `:705` (G1), `:809` (G2) and `:922` (G3).
  - "named below": true once D-13's words for lines 55-59 land.
  - "not scanned": my grep of the file at H finds no `folders.json` and no machine-store read.
  - Ordinary use writes these files.

### Documentation (each one must be fixed before the merge; none blocks)

- **D-10, D-11, D-12, D-14, D-15:** I concur, with the architect's words.
  - D-12 is confirmed at `frontends/shell/e2e/README.md:834`.
  - D-14 is confirmed: the Display arm says this open has no project to save to.
- **D-16:** I concur with the independent review's C1. It needs a POSIX folder flush, so it cannot happen in the shipped Windows app. It is named in the source comments in the architect's words; the code defect goes to Linux L1.
- **D-17:** I concur. The amendment should also record check 5's observation below, and name `second-open-history-before-1c-step-3` (`governance/PLAN.yaml:5571`, present on main).
- **DOC-A.** `protocol/skp/SKP-V0.md:1144` (added in c57f090b) carries "(this amendment)", copied from the form, where it refers to nothing.
  - Replace it with: "(the piece's form, `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, Amendment 20)".
- **DOC-B.** The e2e README says the recorded mutations are in the file's header, each with its commit and run, but `frontends/shell/e2e/project.mjs`'s header has no m-s18 entry. Add:
  ```
  // m-s18: the judgment mapped wrong. In `kernel/src/project/mod.rs`'s `project_relative_of`, `NoCanonicalSpelling` mapped to `Outside`.
  //   Expected: a non-zero exit, failing at NOTICE-S18, S18 not among the save notices.
  //   Observed (run g1c-m-s18 at 9e0d4b08f17ef07033af4ea35b4f512fc7c5a4f6, exit 1):
  //   [NOTICE-S18] FAIL (10013ms): NOTICE-S18: waited 10000ms for S18's text among the save notices; the last reading was [...]
  ```
- **DOC-C.** Item 63's "Not covered: what the steps recorded on the second open do to the first project's record." is now answered (check 5). This is a DRAFT, not the human's.
  - Replace it with: "In that case, a filter or style change recorded on the second open is written into the first project's record, after the mark the first save wrote."
  - Clause check: check 5 below; the matching at `session_history.rs:244-252`; A's mark Written at `project_save_skp.rs:389` before the growth.
- **DOC-D.** The PR body is stale against Amendment 22 item 7. It still says:
  - H is 1e4a7b6f;
  - Amendments 1 to 19;
  - 7,328 lines;
  - "S18 is missing until gate 1's C-2 closes";
  - the old gate state.
  
  It needs:
  - H 9e0d4b08;
  - Amendments 1 to 25;
  - 75 files and 7,748 lines (class 8, Amendments 23 and 25);
  - S18's string in the P6 list;
  - item 63 for the human at the click;
  - the R3-3 words and this round's words (C-1, E-1, DOC-A to DOC-C, D-10 to D-17) listed as applied;
  - the gate state.

### Notes (not findings)

- `protocol/skp/tests/conformance/fixtures/responses-accept.json` has no final LF. It had none at B either, so this is pre-existing.
- K-S15's name, "…leaves_the_first_record_unchanged", holds only across B's saves. The second open's step does change A's record (check 5).
- Independent review E1 (NoStepRecorded is asserted nowhere; confirmed by git grep at H) and E2 stay notes: no §4 row covers them.

## Checks

1. **Scope.**
   - The files changed from 1e4a7b6f to 9e0d4b08 are 18, equal to Amendment 22 item 2's list (diff empty).
   - §2.11's command at B...H counts 75 files and 7503+245 = 7,748 lines, equal to Amendment 25 item 2.
   - The groups match Amendments 23 and 25:

     | Group | Lines |
     |---|---|
     | adr | 51 |
     | e2e | 505 |
     | fixtures, protocol tests, literal | 541 |
     | kernel product | 3241 |
     | kernel tests | 1739 |
     | probe | 144 |
     | protocol product | 479 |
     | records | 55 |
     | renderer | 123 |
     | shell product | 346 |
     | shell tests | 458 |
     | src-tauri | 66 |

   - The lock diffs over B...H and 791e7e9e..H are both 0 bytes.
   - Amendments 20-22 reached main at 4a51e076, before c57f090b. Amendment 24 reached main at 8e09470c, before 9e0d4b08.
   - The class 8 size is recorded, not a finding.
2. **The attempt-2 notes R3-3 closes.** My script reports WORDS-OK.
   - DOC-1/D-8 and DOC-2: the old text appears once at 1e4a7b6f and 0 times at H; the new text 0 times and then once.
   - DOC-3/D-9: the old text twice, then 0; the new text twice at H.
   - Each file at H equals 1e4a7b6f's with only the replacement applied.
   - WORDS2-OK: Amendment 20 item 3's ProjectRelativeLocator doc and Amendment 21 item 2's three texts are each found once at H.
3. **Hashes.** All recomputed hashes match:
   - directive lines 9, 11 and 15 at c1aea32a (on main, file unchanged to HEAD);
   - the R3 and R3-2 reports and the ADR-035 directive;
   - both filing notes' hand-back hashes, from the transcripts (10042 and 12181 bytes).
   - The report bodies equal the hand-backs plus a final LF, except the disclosed cite rewrites (3 and 1).
   - The architect's report has no sha256.
4. **Mutations, run by me.** Each had its old text once, its diff shown, a revert by checkout (rc 0) and an empty porcelain after. All passed before mutation, and all were killed:
   - K-S14: rc 101 at `project_save_skp.rs:360:5`, left Outside, right ThroughLink.
   - P-U3: rc 101 at `commands.rs:839:13`, left "no_canonical_spelling", right "no-canonical-spelling".
   - SH-9: rc 1, 1 failed and 3 passed, at "a reply naming no canonical spelling shows S18 …".
   - K-S15 (check removed): rc 101 at `:427:5`, "B's reply", left Written, right Withheld.
   - M-W5-1: rc 1, 2 failed and 12 passed.
   - m-s18 (e2e):
     - The exe was rebuilt with the mutation and run as g1c-m-s18: rc 1, every step from OPEN to INSIDE-SAVE PASS, then NOTICE-S18 FAIL (10013ms), as DOC-B quotes. The harness tore down cleanly (ports 9223 and 5400 free).
     - I reverted the mutation and rebuilt H's exe (rc 0, "copied exe", 91545088 bytes, mtime 2026-11-12 01:41:50 +0100).
   - None of these is a `verify-mutation` run.
5. **Amendment 21 item 5, by observation.**
   - The temporary assertion went into K-S15 (both anchors found once, diff shown). I ran it in a hold.
   - Result: rc 101, the test FAILED at H 9e0d4b08f17ef07033af4ea35b4f512fc7c5a4f6.
     - Byte-copied: "OBSERVATION: A's record length after A's save 1861, just before B's save 2657; byte reads after A's save Err("The process cannot access the file because another process has locked a portion of the file. (os error 33)"), before B's save Err(…same…)".
     - The panic was at `kernel\tests\project_save_skp.rs:431:5`, left 1861, right 2657.
   - **The second open's recorded step appends to A's record before any save (+796 bytes).** This agrees with R3-2's reading and the architect's.
   - A byte compare is impossible while the record is live: Windows refuses the read with os error 33.
   - Reverted by checkout (rc 0); the porcelain is 0 bytes.
6. **Clippy and fmt.**
   - Clippy (warn-only, short format) exits 0 with 8 distinct warnings, the same 8 file:line:col as at 791e7e9e:
     - `renderer/src/canonical.rs:303:20` and `renderer/src/style.rs:10:5`;
     - in `kernel/src`: `permission/boundary.rs:536:26`, `publish/mod.rs:839:67`, `skp.rs:277:10`, `lib.rs:415:10`, `lib.rs:490:10` and `bin/publish-bundle.rs:149:12`.
   - My blame-mapping script failed on a backslash lost in its heredoc (my error), so I compared the positions directly.
   - `cargo fmt --all -- --check`: rc 0, 0 bytes of output.
7. **`npm run verify`.** Typecheck, the build and the checks pass.
   - Vitest: 111 files and 1456 tests, 1455 passed and 1 failed.
   - The failure was `noticeDeterminism.test.ts` timing out at 30000 ms. The log holds 37 "Blocking waiting for file lock on package cache" lines: another cargo process held the shared package cache.
   - **For the custodian:** this is timing-sensitive in a shared run, so it is not recorded as a failure.
   - Re-run alone in a hold: 1 passed (9.09 s), with no lock wait.
   - The chain had stopped at `npm run test`, so I ran its four tail scripts in the same hold: residency-trace 76/0, citation-integrity 30/0, export-elapsed 5/0 and s5d-verdict 7/0, all rc 0.
8. **Governance checks.**
   - verify-cites: PASS, 2847 files.
   - verify-test-claims: PASS, 790 claims.
   - verify.mjs --offline: PASS.
   - verify-quotes (in a hold): PASS. 155 checked, 124 verified, 30 baselined, 1 advisory, 0 hash-reference errors and 924 ruling cites resolved.
9. **Bytes.** R3's 460 added lines have no CR and no tab. Every changed file holds no CR and ends with LF, except the pre-existing fixture in Notes.
10. **The worker reports against the code.**
    - The numstat claims match `git show --numstat`, R3-2's at 129/16.
    - The line claims hold at c57f090b (enum `:765`, field `:740`, `project_relative_of` `:372`).
    - Item 63's text in the R3-2 report is byte-equal to `KNOWN-LIMITATIONS.md:506-508` (cmp 0).
    - The `HeldByAnotherProject` check sits right after `find`, before NoStep and Differs.
    - Departures graded:
      - Lengths instead of bytes: acceptable given the lock (shown in check 5). It goes to the human, below.
      - `Projects::history`'s private doc is true.
      - The use line is trivial.
    - R3's disclosures: the heredoc script is byte-clean; "(this amendment)" is DOC-A; the missing m-s18 header entry is DOC-B.
11. **The two readings.**
    - Independent review: C1 is D-16, concurred. C2 (a save before any step) is folded into C-1 and goes to the human below. E1 and E2 are notes. Documentation items 1-3 are D-14, D-15 and D-16. D-15's temp-file case needs a crash inside the save, so it is named and does not block.
    - Drift sweep finding 1 is confirmed at H; it is E-1 and D-13.
12. **CI and the PR body.**
    - `gh pr checks 307`, read at 2026-11-12T01:01:10Z: 18 pass.
    - The 12 runs I checked at 00:35:48Z all ran on headSha 9e0d4b08 and all succeeded.
    - The PR is a draft at 9e0d4b08; its body was last updated 2026-11-11T23:04:58Z and is stale (DOC-D).
13. **Porcelain afterwards.** `git status --porcelain` in `C:/dev/wt/b2c` gives 0 bytes; HEAD is 9e0d4b08f17ef07033af4ea35b4f512fc7c5a4f6.

## For the human

- **H-1.** The ruling says A's record bytes are equal before and after B's save. K-S15 compares lengths: a byte read is refused while the recorder holds the record (os error 33, check 5). `recover` runs only after the recorder is dropped. Does a length check meet the ruling?
- **H-2.** Amendment 21 item 5 is answered by observation: the second open's steps are appended to A's record. By the ruling, an S3 node is proposed and the form says so. `second-open-history-before-1c-step-3` is placed, and the form's record of it is D-17.
- **H-3.** The independent review's C2: ADR-036 Amendment 1 item 5 is silent on a save made before any step. Any ADR text on it is the human's to word. C-1's words describe the code's behaviour.
- **H-4.** Item 63 (with C-1 and DOC-C applied) goes to the human at the click, as the ruling orders.

## The packet's gaps

- No pointer to `write_machine_file` and the machine store's two files, which E-1 needed.
- No pointer to `same_claims`, `adopt_project` or `close_dataset`, which C-1 needed.
- No anchor text for the mutations or for check 5's assertion.
- No note that the architect's completed report was not yet filed on main.
- R2's numstat given only by reference.
- No notice that `responses-accept.json` already lacked its final LF at B.

## Hold lines (this project's only, `also=` elided)

Each was `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> also=<elided> (…)`, followed by `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:<pid> affinity=FF (cores 0-7)`. The pids:

| Run | pid |
|---|---|
| baseline | 57804 |
| mutations | 36280 |
| m-s18 build | 43900 |
| m-s18 run | 66172 |
| H-restore build | 21568 |
| check 5 | 73528 |
| clippy | 42264 |
| fmt | 12728 |
| npm verify | 29336 |
| notice re-run and verify tail | 82312 |
| verify-quotes | 74648 |

There were no refusals and no exit code from 96 to 99.

## Background shells left

None. Tasks b496grpxg, byqi96b2l, b5jstlwl9 and bde8qlsez all completed, and no cargo.exe is running.

## Model

Opus 5.5 (claude-opus-5-5).
