Reviewed: PR #254 at 3fdb355b161ed24baecf49ad3607d7f74bf74c5f, reviewer
Branch: docs/filler-slot-rule @ 3fdb355b161ed24baecf49ad3607d7f74bf74c5f
Verdict: PASS WITH NOTES. There are no Correctness or Evidence findings. Two Documentation findings must be fixed in this PR before the merge, with no re-gate.

## Correctness
None.

## Evidence
None.

Note on what the tools cover. At the PR head the tools are unchanged from main; both files were last changed at 1b529f497153519c139f34e8029ccdc752f9fdd0. Neither tool checks the §36 pin's hash:
- verify-quotes only hash-scans the preregistration and ADR files, `AI_DEVELOPMENT.md`, `docs/PREREGISTRATION-TEMPLATE.md`, the ruling files and `.claude/agents/*.md` (`scripts/plan/verify-quotes.mjs`, `EXTRA_HASH_SCAN_FILES` and `defaultHashScanFiles`). `AUTONOMY.md` is not in that set.
- verify-cites `checkPinned` only checks that the pinned line exists at the pinned commit. It does not check the hash.
- Governance CI's `pull_request` path filter (`.github/workflows/governance-ci.yml`, the `on:` block) does not list `AUTONOMY.md`, so neither tool runs in this PR's CI.

The proof of the pin is therefore my own recomputation in check 2. This is not a finding against this PR.

## Documentation (must fix before the merge; not the human's wording, so the worker applies these words with no re-gate and the PR body lists them)

**D1. The second bullet restates the rule (check 3).** The bullet's sentence "Its first entries are the eight numbered items of the weekend exception of 2026-10-24" repeats the rule's own clause "its eight numbered items are the filler queue's first entries, in that order". Its "in the human's order" repeats the rule's "which I order". Both are true and change nothing, but they restate the rule where a reference would do.

Replacement words for the whole bullet:
`- **The filler queue:** `state/FILLER-QUEUE.md`. The weekend exception the rule names is `state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md`; its numbered items are its lines 9 to 16.`

Clause check:
- (a) "The filler queue: `state/FILLER-QUEUE.md`": the file exists at the PR head and line 1 reads `# The filler queue`.
- (b) "The weekend exception the rule names is <path>": the rule names "The weekend exception of 2026-10-24". That file's line 1 heading starts "# 2026-10-24: a weekend exception", and its line 6 reads "To the custodian, 2026-10-24. A weekend exception, my word, until Monday 2026-10-26."
- (c) "its numbered items are its lines 9 to 16": in that file at the PR head, lines 9 to 16 start "1." through "8.", and lines 8 and 17 are not numbered items.

**D2. A thematic break that no other section has.** `AUTONOMY.md` line 687 at the PR head is `---`. `grep -c '^---$'` on the file prints 1 (rc 0), so no other section of §1 to §35 is preceded by one. §35, for example, is a blank line 667 then the heading at 668.

Replacement: delete line 687 and keep the blank line 686 directly before the `## §36.` heading.
Clause check: the heading convention is read from lines 467/468, 471/472, 529/530, 552/553, 641/642 and 667/668. Each pair is a blank line, then the `## §` heading.

No finding on the rule's words, which are the human's. No finding on the heading or the intro sentence:
- The heading's "(the human, 2026-10-24; …, line 8; appended after §35 so that no line a record cites above it moves)" follows the §23–§35 form.
- The intro's "(its line 6)" matches line 6, "append it to AUTONOMY in these words".
- The pin is at a main commit: `git merge-base --is-ancestor ae8cfdcc… origin/main` rc 0.
- The pin is written on one line, contiguous.

The first bullet ("queued at 14:01:54Z (the directive's filing note)") matches the filing note's "queued at 14:01:54Z on 2026-10-24". Its "applies from the human's message … before this section merged" is not in the rule's words. It is the custodian's reading, and the records support it: `state/FILLER-QUEUE.md` line 3 says "in force from that message", and the rule says the weekend exception, already in force, "becomes this rule". I accept it.

## Checks

**Setup.**
- `git fetch origin`: rc 0.
- The worktree HEAD is 3fdb355b161ed24baecf49ad3607d7f74bf74c5f (rc 0), and `git status --porcelain` is empty (rc 0).
- `git merge-base origin/main 3fdb355b…` gives c86369e0b0cbfe136bf886ce876e2d118ec81e48 (rc 0), which equals origin/main.
- `gh pr view 254`: isDraft true, head docs/filler-slot-rule at 3fdb355b…, base main (rc 0).
- `git log c86369e0..3fdb355b` shows one commit (rc 0).

**1. Diff shape: PASS.**
- `git diff --numstat c86369e0… 3fdb355b…` rc 0 prints `12	0	AUTONOMY.md` and nothing else.
- `git diff -U0` rc 0 shows the one hunk `@@ -685,0 +686,12 @@`.
- The base `AUTONOMY.md` has 685 lines and ends in `\n` (`wc -l`, `tail -c 1 | od -c`). Every added line comes after the base's last line, and nothing above it moves.

**2. Byte equality and pin: PASS.**
- `git show ae8cfdcc5dd632473a561a48c4401a08ccd8cb0e:<directive>` and `git show 3fdb355b…:<directive>` both rc 0. `cmp` of the two files rc 0: the directive is identical at both commits.
- In `AUTONOMY.md` at the head, `grep -n '^```text$'` puts the last fence at 692. Line 693 was taken with `sed -n 693p`, and line 694 is the closing fence.
- `cmp` of line 693 against the directive's `sed -n 8p` at ae8cfdcc: rc 0. Against the same line at the PR head: rc 0.
- `sha256sum` of line 8 plus its LF, at ae8cfdcc, is 1135b89c01d0e676bce0bc42a4d6710af445fa0ae95ed12ef6ca0fef7a4d4e84 (rc 0). This equals the pin's hex, which appears exactly once in the file (`grep -c` gives 1, rc 0).
- `file` reports no CRLF in either file.

**3. The custodian's words: two Documentation findings (D1, D2 above).** Sources read at the PR head:
- the directive's lines 1 to 8
- `state/FILLER-QUEUE.md`, all 35 lines
- the weekend directive's lines 1 to 19

**4. Tools and CI.**
- `node scripts/plan/verify-cites.mjs` rc 0: "verify:cites PASS — every rooted (in-tree) path:line reference across 2339 file(s) resolves. (97 loose reference(s) advised above.)". None of the advisories is in `AUTONOMY.md` (`grep AUTONOMY` over the output gives rc 1).
- `node scripts/plan/verify-quotes.mjs` rc 0: "verify:quotes PASS — 131 checked, 100 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 859 ruling cites resolved, 0 ruling-cite errors."
- `gh pr checks 254` rc 0. All four checks pass and none is in progress: "every commit is signed off", "no profile path in the range", and "ported-notices" twice. Governance CI is not triggered for this path (see the Evidence note).

The scratch outputs are named `fs36-r-*` in my scratch folder. I wrote no other file and changed nothing in any repository.
