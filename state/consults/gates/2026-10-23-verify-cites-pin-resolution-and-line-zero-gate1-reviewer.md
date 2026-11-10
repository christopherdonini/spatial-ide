Reviewed: PR #247 at 7a23dbad24d3efc923e5108a9047811a2909aacf, gate 1, reviewer (cut/verify-cites-pin-resolution-and-line-zero @ 7a23dbad24d3efc923e5108a9047811a2909aacf)
Verdict: FAIL

The fail is on wording only. The code does what §2 says. Every recorded mutation, I1, I2, the suites and CI reproduce. The two blocking findings are header doc-comment sentences that claim a limit or guarantee the code does not have (§8 item 7). An untrue claim of a limit stays a Correctness finding (AUTONOMY §31, the item's g). These sentences are not the human's words, so under §31(d) the worker applies the replacement words below with no re-gate, and the PR body lists them.

## Correctness

**C-1. The header's pin-limit sentence is untrue: "only" does not hold.**
- Where: `scripts/plan/verify-cites.mjs:64-66` at the head. Byte-copied span: "tree is read at the path as written only".
- What is wrong: when the meant file is gone from the tree but another tracked file matches the path's suffix, the pin is also read at that other file, and the cite can pass there. My probe (scratch `vcpin-g1r-probe.mjs`, main's checker at 2ffbf957 against the head's):
  - P1, a basename cite `pool.rs` at line 4, pinned. `engine/src/pool.rs` is deleted and `renderer/pool.rs` (5 lines at the pin, 2 now) remains. Main reports it as advisory with the reason "line 4 exceeds renderer/pool.rs (3 lines)". The head passes it (advisory empty).
  - P2, a relative cite `src/App.tsx` from `frontends/shell/NOTE.md`. Its file is deleted and `renderer/v/src/App.tsx` remains. The result is the same: advisory at main, a pass at the head.
- Ordinary use can reach this (same-basename siblings are common).
- Fix: replace the span from "a pin is read at the files the tree resolves the path to," through "is not read at its pin." with:

  > a pin is read at the files the tree now resolves the path to, then at the path as written, and the pin commit's own file list is never searched: a relative, `.md`-fallback or basename cite to a file no longer in the tree is read at the path as written and at any other file the tree now matches the path to, and can pass at one the author did not mean; a loose cite matching nothing is not read at its pin.

- Clause check against the head:
  1. "read at the files the tree now resolves the path to, then at the path as written": lines 364-365 build the list. It comes from `resolveRef` over the current index (`buildTrackedIndex`, line 333), with the path as written last.
  2. "the pin commit's own file list is never searched": `checkPinned` runs only `cat-file -e`, `cat-file blob` and `cat-file -t` on the listed paths (lines 281, 286, 288). There is no tree listing.
  3. "read at the path as written": it is always the last list element. T-D4d proves it is read.
  4. "and at any other file the tree now matches the path to": `rr.all` is the suffix set when `rr.exact` is empty (line 365; `resolveRef` lines 203-211). Probes P1 and P2 show it.
  5. "can pass at one the author did not mean": P1 and P2 pass at the head.
  6. "a loose cite matching nothing is not read at its pin": the condition at line 363.

**C-2. The header's line-0 sentence is too broad.**
- Where: `scripts/plan/verify-cites.mjs:14-15` at the head. Byte-copied span: "A cite starting or ending at line 0 fails with a reason naming line 0".
- What is wrong: some line-0 cites get another reason, or are not reported at all. Probes:
  - P3, a rooted line-0 cite into a path that matches nothing: reason `no tracked file matches "engine/src/gone.rs"`.
  - P4, a line-0 cite pinned at a missing commit: reason `pinned commit deadbee0 not found`.
  - A loose line-0 cite that matches nothing is skipped (line 374).
  - Form §2.1 itself keeps the no-match reason, so this is the header overstating the code.
- Fix: replace the sentence with:

  > A cite starting or ending at line 0 never resolves; where its reason is about the line (the tree's exact and suffix tiers, and a file found at a pin), the reason names line 0 (lines count from 1).

- Clause check:
  1. "never resolves": `inRange` requires `validStart` (lines 256-257). The pin's line-0 branch (lines 293-294) never returns ok.
  2. "the tree's exact and suffix tiers": lines 260 and 266 return the line-0 reasons before any "exceeds" reason (T-C3a).
  3. "a file found at a pin": line 294 applies only after a blob read succeeds (T-C3b). The other reasons (no match at line 374, commit at 281, directory at 289, missing at 299) are not about the line, so the "where" clause excludes them (P3, P4).

**C-3. The same untrue limit is in the form.**
- Where: `scripts/plan/VERIFY-CITES-PIN-RESOLUTION-AND-LINE-ZERO-PREREGISTRATION.md:44` at main cfbf1e80 (§1, the first may-not-claim bullet, second sentence: "Such a cite is read at the path as written only, as today;"). The same wording is in §2.3's second bullet (line 88).
- These are the architect's words, not the human's.
- The form is append-only. Fix: append an amendment item worded as:

  > §1's first may-not-claim bullet and §2.3's second bullet are corrected: a relative, `.md`-fallback or basename cite to a file no longer in the tree is read at the path as written and at any other file the tree now matches its path to, and can pass at a file the author did not mean (gate 1 reviewer, probes P1 and P2). The header carries the corrected sentence.

- Clause check: the same as C-1, clauses 3 to 5.

## Evidence

None blocking.

Non-blocking note: §2.2's "first failure ... in list order" (and the `checkPinned` JSDoc's "else the first failure") is pinned by no test. My extra mutation X1 (`failure ??=` changed to `failure =`, so the last failure wins) survives: 32 of 32 pass. Probe P5 shows the code does it: two suffix candidates, both short at the pin, give the reason naming the first, `"a/x/pool.rs"`. A test could go into a follow-up node. §1 claims nothing about the ordering.

## Documentation (must fix before merge, no re-gate)

**D-1. The PR body names the wrong source for the header's sentences.**
- The PR body says: "The line-0 reasons and the header's sentences are the architect's wording (§2.1), not the human's."
- §2.1 holds only the three reason strings. §2.3 gives the header direction; it drafts the D4 sentence and does not word the line-0 sentence.
- Replacement: "The line-0 reasons are the architect's wording (§2.1); the header's sentences follow §2.3, worded by the worker and corrected by the gate 1 reviewer's words; none is the human's."
- Clause check:
  - §2.1 holds the three strings (form lines 69-71).
  - §2.3 holds the header direction (lines 86-89).
  - The human's item 2 rules OPEN-1 to OPEN-3 only (Amendment 1, item 2).

## §8 items
1. No export verify-quotes imports changed: PASS. `verify-quotes.mjs:137` imports buildTrackedIndex, extractCitations, resolveRef, classifyPath, topDirsOf and CODE_EXTS. No diff hunk touches them, and `verify-quotes.mjs` is not in the diff.
2. No new export, and no optional or default parameter: PASS. `paths` is required, and its one product caller is line 365. The grep for callers shows no other caller.
3. No pass-to-fail and no tier change in I1 or I2: PASS (my multiset runs below).
4. No gated token: PASS. `verify-cites.mjs` at the head reports 0 gated.
5. No mutation recorded from a `verify-mutation` run: PASS. The test comments say "applied alone and reverted", and I re-observed every mutation by hand.
6. Diff within §7: PASS. Two files, 60 / 106 / 166. verify-cites.mjs is exactly at its ceiling of 60.
7. A header sentence claims a resolution or limit the code does not have: **FAIL** (C-1, C-2).

## What I checked
1. **Diff:** `git diff e408606d...7a23dbad` rc=0; `--stat` rc=0. Two files, +141 −25, two commits (eb499a89, 7a23dbad). The merge-base is e408606d. Main changed neither file between e408606d and cfbf1e80 (empty stat, rc=0). Main moved to 73524a95 during my run, again with no change to the piece's files, verify-quotes.mjs or the form (rc=0).
2. **Mutations, by hand at the head** in the throwaway `C:/dev/wt/vcpin-g1r` (detached, `core.longpaths=true`). My scratch script `vcpin-g1r-mut.mjs` exits 0. For each mutation it edits the file, runs `node --test --test-reporter=tap scripts/plan/verify-cites.test.mjs`, and reverts with `git checkout`; the porcelain was `""` after every revert.

   | Mutation | node --test exit | Failing tests |
   |---|---|---|
   | M-C3a | 1 | `a_cite_starting_at_line_0_is_reported_at_line_0_in_the_tree` only |
   | M-C3b | 1 | `a_pinned_cite_starting_at_line_0_is_reported_at_line_0_at_its_pin` only |
   | M-D4a | 1 | T-D4a, T-D4b, T-D4c |
   | M-D4b | 1 | T-D4b, T-D4c (as Amendment 2 says) |
   | M-D4c (failure kept only from the last path) | 1 | T-D4c only |
   | M-D4d | 1 | T-D4d and `a_pinned_cite_whose_path_is_a_directory_at_that_commit_fails_by_name` (as Amendment 2 says) |
   | M-D4d2 (narrowed) | 1 | T-D4d only |
   | C2 | 1 | `a_pinned_loose_cite_keeps_the_trees_reason_when_the_pin_path_is_not_found` only |
   | X1 (mine) | 0 | none; survives |

   Unmutated: exit 0, 32 of 32 pass.
3. **I1 and I2.**
   - I read the filed instrument (sha256 3271b947…, matching the run record) and did not run it. It keys rows by (relPath, citeLine, target) in a Map, so it could collapse duplicate rows. My own `vcpin-g1r-i.mjs` compares full rows (tier, path, line, target, reason) as multisets and flags tier changes.
   - Main's checker is `git show 2ffbf957:scripts/plan/verify-cites.mjs`, sha256 d70d3f7d…. That equals e408606d's file, so "I1 at B, the same code" holds. The head's checker is sha256 7e4ec32b….
   - I1 over a detached checkout of 2ffbf957 (`C:/dev/wt/vcpin-g1r-i1`, porcelain empty), rc=0: gated 0/0, advisory 110/110, scanned 2242.
   - I2 over the head's tree (`vcpin-g1r`), rc=0: gated 0/0, advisory 108/108, scanned 2261.
   - Each run has exactly one row only in A and one only in B: the gate report's line-54 cite to `engine/src/pool.rs` lines 0 to 2. Its class is REASON-ONLY; the old reason names line 2 exceeding the file, the new one is the line-0 exact-tier wording. Nothing left the set, was added, or changed tier.
   - This matches the filed outputs (their sha256 values recomputed equal to the run record's) and §3.
   - Probes P1 to P5 (`vcpin-g1r-probe.mjs`, rc=0) are quoted above.
4. **§7:** `git diff --numstat` rc=0: 37+23=60 (≤60), 104+2=106 (≤150), total 166 (≤210).
5. **Hash pins:** `vcpin-g1r-pins.mjs` at main cfbf1e80, rc=0. Each of the form's 26 pins was recomputed at the commit it names (`git show <rev>:<path>`, lines joined with a final newline): 26 OK, 0 bad, and 26 sha256 tokens in the form. Also checked:
   - The worker report hashes to 424b534a… and the draft to 29a8d28a… (line 5 to the end), as their filing notes say.
   - The form diff e408606d→cfbf1e80 has 0 deleted lines (append-only).
6. **Suites at the head** (in `vcpin-g1r`):

   | Check | rc | Result |
   |---|---|---|
   | `verify.mjs` | 0 | PASS |
   | `verify-cites.mjs` | 0 | PASS, 2261 files, 108 advised |
   | `verify-quotes.mjs` | 0 | PASS, 131 checked, 0 hash-reference errors, 0 ruling-cite errors |
   | `verify-test-claims.mjs` | 0 | PASS, 632 claimed tests |
   | `queue.mjs --check` | 0 | current |
   | `site.mjs --check` | 0 | current |
   | scripts suite `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` | 0 | tests 549, pass 549, fail 0, cancelled 0, skipped 0 |

   The scripts suite ran inside a shared hold (MACHINE_HOLD shared project=SpatialIDE cores=0-7, then released). There was no guardian-parity failure. The throwaway's porcelain was empty afterwards.
7. **CI** (`gh pr checks 247` rc=0, `gh run list` rc=0): every check passes. The runs at head 7a23dbad24d3efc923e5108a9047811a2909aacf:
   - DCO 39957324231
   - Ported notices 39957324036 and 39949788679
   - Governance CI 39957323980 and 39949788581
   - Exposure scan 39957323989

   The PR is a draft and open, with base main and head 7a23dbad.

**Cleanup:**
- `git worktree remove` succeeded for both throwaways (rc=0 each). Neither folder exists, and `git worktree list` (rc=0) shows neither `vcpin-g1r` nor `vcpin-g1r-i1`.
- `C:/dev/wt/vcpin` is at 7a23dbad with an empty porcelain (rc=0, 0 bytes).
- The probe repositories were deleted by the probe script.
- I made no commit, push or PR action. All my scratch files are named `vcpin-g1r-*` in my scratch folder.
