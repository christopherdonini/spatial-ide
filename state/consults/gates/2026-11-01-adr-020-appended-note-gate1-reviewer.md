Reviewed: PR #271 at 5ff86b13fcca3854eed89076426f30fb1a37f9b8 (base ae71bd8a), gate 1, reviewer
cut/adr-020-appended-note @ 5ff86b13fcca3854eed89076426f30fb1a37f9b8
Verdict: PASS WITH NOTES

## Correctness
None. The diff makes no claim of a guarantee, a limit or a measurement that is false. No quote marked verbatim fails to match its source: the reproduction line equals entry 54's span byte for byte (E4). The red-line text is the approved §2.1 block, filled the way OPEN-1 (A) says.

## Evidence
None. E1 to E11 and C1 all hold. Results are in check 3 and check 4 below.

## Documentation (fix before the merge, no re-gate)
**D1. The PR body says the corrigendum's authorship wrongly** (PR #271 body, the OPEN-1 (A) bullet). It says the block "is the human's typed words". It is not. Form line 16 says the words are the architect's, not the human's. Directive item 4, at line 14, is the human's typed "yes to §2.1's words": an approval of the architect's draft. This line is the worker's or the custodian's, not the human's wording, so the worker applies these words with no re-gate and the PR body lists them.

Replacement words for that bullet:
"OPEN-1 (A): the block is §2.1's words, the architect's draft, approved by the human's typed word (item 4 of the 2026-10-22 directive), headed Corrigendum, the date being the appending commit's UTC date;"

Each clause checked:
- **"§2.1's words":** my script (check 1) found the appended block token-equal to §2.1 with the three fills, 124 = 124 tokens. Paragraphs 0, 2 and 3 are byte-identical line by line. Paragraph 1 is only rewrapped around the 156-column directive path, which the settlement allows.
- **"the architect's draft":** form line 16.
- **"approved by the human's typed word (item 4 …)":** the directive at line 14, plus its filing note at line 3, which calls it the human's typed message.
- **"headed Corrigendum":** the diff's heading line.
- **"the appending commit's UTC date":** the commit's %cI is 2026-11-01T01:31:21+01:00, which is 2026-11-01 UTC. The heading carries 2026-11-01.

The commit message of 5ff86b13 has the same phrase ("The block is the human's typed words"). It cannot be corrected without a history rewrite, so leave it. The merge commit message should not repeat it.

**Note, not owed by this PR:** the line-403 entry in `scripts/plan/verify-quotes.baseline.json` still has a `reason` that ends "an appended ADR-020 note is owed." verify-quotes prints that reason at H (seen in my E5 output), so after the merge the printed text still says "owed". The human's ruling and the settlement admit the `corrected_by` value and only that value, so changing it here would be a scope breach. It is for the custodian to place, if anywhere.

## Check 1: the diff (`git diff ae71bd8a...5ff86b13`, rc=0)
- Two files: ADR-020 +15/-0 and the baseline +1/-1. `--name-only` lists only those two.
- My script `a020-g1r-check1.mjs` exited with rc=0 and 0 FAILs:
  - **B is a byte prefix of H**, B ends in LF, and the appended part ends in exactly one LF.
  - **The block matches §2.1.** The template is §2.1's fenced block, lines 96–108 of the form on main. Fills: `<DATE>` = 2026-11-01 (both committer and author date in UTC), `<DIRECTIVE>` = the directive path in backticks, `<N>` = 4. The appended block is token-equal to the filled template. 4 paragraphs on each side; only paragraph 1 is rewrapped, from 2 lines to 4, with the path whole on its own line, as the settlement allows.
  - **§2.0 rules:**
    - The block opens with one blank line.
    - (b) No hash and no path:line inside it.
    - (c) No Status line.
    - (e) Exactly 2 quotation marks, both on the last line, in the `*"` … `"*` wrapper.
    - (d) The reproduction is the last line, with nothing after it.
    - (f) Every line is ≤ 100 columns except the directive-path line, which is 156.
  - **The baseline:**
    - Same line count, exactly one line differs (line 26), and that line is the `corrected_by` line.
    - The H value equals OPEN-3's proposed-value block (form line 315) byte for byte.
    - Disposition is `owed-correction` at both B and H.
    - The 403 entry is otherwise equal, every other entry is equal, and the top-level keys are equal.
- **Hazard scan** (`a020-g1r-hazard.mjs`, rc=0):
  - It self-tested positive on B's ADR-020:403.
  - It searched for the §(c) sentence plus a full stop, after stripping backticks, asterisks, underscores and quotation marks. It found no hit in the appended block and none in the baseline at H. The sentence appears in the block without a stop.
- **Order and scope:**
  - The form is at B (ae71bd8a, committed 01:19:17+01:00) and is byte-equal to main's copy (cmp=0). The settlement, which records the class 9 addition, therefore precedes the code commit (01:31:21+01:00).
  - #242's merge c52abe27 is an ancestor of B (rc=0).
  - Main's ADR-020 and baseline equal B's (`git diff --quiet`, rc=0 for each).
- **§8, item by item:**
  1. No byte of B changed (E2). Holds.
  2. No hazard form in any file the piece writes (hazard scan; C1). Holds.
  3. The words equal §2.1 as approved by item 4 (dated 2026-10-22), and the commit is 2026-11-01. Holds.
  4. The diff has no line cite into DECISIONS-PENDING or its archive, no bare `:line` into ADR-020, and no pin at all. All 52 of the form's pins are full revs on main. Holds.
  5. The diff makes no tool claim. Holds.
  6. Paths are P1 and P4 only. P4 is admitted under OPEN-3 (a), with #242 merged. Nothing is under `protocol/`. Holds.
  7. The corrigendum claims no corrected §(c), no changed decision, and no "Appended <date>" form. Holds.
  8. No Status line, and `docs/README.md` is unchanged (rc=0). Holds.
  9. P1 is 15 insertions, ≤ 20, with 0 deletions; P4 is 1 + 1 = 2, ≤ 2. §7 is not edited, since the form is unchanged at H. The class 9 addition is recorded before the code. Holds.
  10. The worker report, PR body and commit message call C1 a control run and never a mutation. Holds.
  - Item 11 is history, per the settlement.

## Check 2: pins (`a020-g1r-pins.mjs`, rc=0)
- **The form:** 52 pins (the lead line's count). Each was recomputed by `git show <rev>:<path>`, slicing the lines with their LFs and taking sha256. 52 OK, 0 FAIL. All revs are full 40-character ids, and all are ancestors of main.
- **The diff:** 0 pins (whole ADR-020 at H, and the baseline). No split pin was found.
- The form's unpinned draft hash also checks out: `state/consults/2026-10-22-adr-020-appended-note-architect-draft.md`, line 5 to the end, gives a22c0606…6248, a match. The draft is tracked (added in ae1f1881) but is not present at 708f4169; the lead line says it was "read only at main 708f4169". This is a note only: it is not a pin and nothing fails.

## Check 3: E1 to E10 and C1 (at H in C:/dev/wt/a020; tools at commit 5ff86b13)
| Check | What ran | Exit code | Result |
|---|---|---|---|
| E1 | `git diff --numstat B...H -- ADR-020` | 0 | 15 insertions, 0 deletions |
| E2 | the form's node prefix check | 0 | B is a byte prefix of H |
| E3 | node | 0 | worktree file equals H's; no CR byte; last byte is LF |
| E4 | `a020-g1r-e4.mjs` | 0 at B (self-test), 0 at H | details below |
| E5 | `node scripts/plan/verify-quotes.mjs` | 0 at H, 0 at B | details below |
| E6 | `verify-cites.mjs` | 0 | PASS, 2537 files |
| E7 | `verify-test-claims.mjs`; `verify.mjs` | 0; 0 | 701 claimed tests; verify:plan PASS |
| E8 | `npm run verify:adr-index` in `frontends/shell` | 0 | "34 ADRs, index in docs/README.md matches every Status line"; `docs/README.md` unchanged B→H; C's line-58 row is present at H line 58 |
| E9 | `queue.mjs --check`; `site.mjs --check` | 0; 0 | both current |
| E10 | governance-ci's command (governance-ci.yml:150) | 0 | 590 tests, 590 pass, 0 fail |

- **E4:**
  - Entry 54's head is found once in the archive at B. The next entry head is 53. The entry has 1 italic quoted span.
  - That span without its wrapper equals B's :403 minus `> ` and its last byte, and that last byte is a full stop.
  - At B, 0 lines of ADR-020 equal the span. At H, 1 line does: the block's last line.
- **E5:**
  - H: 135 checked, 104 verified, 30 baselined, 1 advisory, 897 ruling cites, 0 errors.
  - B (from my checkout with B's two files, the tree equal to B by `git diff --quiet`, rc=0): 134 checked, 103 verified, 30 baselined, 1 advisory, 896 ruling cites, 0 errors.
  - `diff` of the two outputs differs only in the PASS line.
  - ADR-020:403 is in H's baselined list with the entry's reason.
  - The count of "matched nothing" lines at H is 0 (grep rc=1, meaning none). The pattern self-tested positive in C1.
- **C1, a control run and not a mutation,** at H = 5ff86b13fcca3854eed89076426f30fb1a37f9b8:
  - `git worktree add --detach C:/dev/wt/a020-g1r-c1 5ff86b13…` (rc=0).
  - After the E5 B run I restored the two files to H; the porcelain was 0 bytes.
  - Change: the reproduction line (line 693) had its wrapper removed and a full stop appended (`git diff --numstat` 1/1).
  - verify-quotes rc=0. It printed "1 baseline entry matched nothing this run", naming ADR-020:403. Counts: 134 checked, 104 verified, 29 baselined. This is as predicted.
  - Restored with `git checkout --` (rc=0); porcelain 0 bytes; HEAD 5ff86b13.
  - `git worktree remove` rc=0. The path no longer exists (test -e rc=1), and `git worktree list` no longer shows it.

## Check 4: E11, CI
`gh pr checks 271` rc=0, all checks pass. The PR is a draft, head 5ff86b13fcca3854eed89076426f30fb1a37f9b8, base main. `gh run view` gave each run's head sha (each rc=0); every run is completed and successful:

| Run | Workflow | Event | Head sha |
|---|---|---|---|
| 41258546114 | Governance CI | push | 5ff86b13fcca3854eed89076426f30fb1a37f9b8 |
| 41258730075 | Governance CI | pull_request | 5ff86b13fcca3854eed89076426f30fb1a37f9b8 |
| 41258730126 | DCO sign-off | pull_request | 5ff86b13fcca3854eed89076426f30fb1a37f9b8 |
| 41258730125 | Exposure scan | pull_request | 5ff86b13fcca3854eed89076426f30fb1a37f9b8 |
| 41258546374 | Ported notices | push | 5ff86b13fcca3854eed89076426f30fb1a37f9b8 |
| 41258730147 | Ported notices | pull_request | 5ff86b13fcca3854eed89076426f30fb1a37f9b8 |

No run was in progress, so no wait was needed.

## Background shells and state at the end
- The harness moved four of my foreground calls to the background after 180 s: the H verify-quotes run, the B verify-quotes run, one wait loop and the C1 verify-quotes run. All four completed, each with a completion notice and exit code 0. Each wait loop slept 5 s per turn and had a hard deadline. None is still running, and I killed nothing.
- `C:/dev/wt/a020`: porcelain 0 bytes, HEAD 5ff86b13fcca3854eed89076426f30fb1a37f9b8.
- `C:/dev/wt/a020-g1r-c1`: removed.
- My files are only `a020-g1r-*` in <scratch>.
