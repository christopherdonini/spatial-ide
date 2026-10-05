# PR #179 gate 1 — reviewer
Reviewed: docs/adr-034-acceptance-words @ 0cb22fa39e58c248e307d464b93b9f3acdf596a4

**Verdict: PASS.** No Correctness finding, no Evidence finding. No Documentation and record finding that needs a fix before the merge; two notes below, neither a finding against this diff.

Base: main at 185bd85fe7f893028f2de0a988ae1e73e652745b (merge-base); origin/main at review time 1d41159bca0f88ae2edce7163af92b0a50e094ca. The ADR-034 blob is c21a319f28ec2078b1b74eb54855fb8823b887fe at both, so main has not drifted under this file.

## Checks

**Diff scope (three-dot).** One file, 13 insertions, 0 deletions: `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md`. The single hunk starts after the Acceptance section's last bullet (old line 201); no line above it is changed, so the Status line, the Decision and the existing bullets are untouched. `docs/README.md` has no diff (0 lines). Added lines carry no CR and no trailing whitespace (`cat -A`). Two commits: 4ed2b479ab764ec82836fdb3bf72125ab275b23a and 0cb22fa39e58c248e307d464b93b9f3acdf596a4, both signed off.

**Byte-exactness (Correctness; recomputed by script).**
- The fenced block is lines 206-213 of the head file (fence lines 205 `text` and 214).
- Block lines 206-213 plus one final newline: sha256 f3a8c75f9833edef2853331bd70118b460774b26ceb849d44b7f7587984c9485.
- `state/directives/2026-10-05-adr-034-acceptance.md` lines 6-13 at origin/main: sha256 f3a8c75f9833edef2853331bd70118b460774b26ceb849d44b7f7587984c9485.
- The same span at a1109023445211651627541a0c1f637690fe2f1d: sha256 f3a8c75f9833edef2853331bd70118b460774b26ceb849d44b7f7587984c9485.
- `cmp` block against each source span: identical (rc 0 both). `file`: ASCII text, no CRLF; last byte LF.
- Completeness: the source file is 13 lines; lines 6-13 are everything below its rule (line 5), so no part of the human's words is left out and nothing is elided.

**The appended paragraph's claims (Evidence).**
- `state/directives/2026-10-05-product-first-clarification.md` exists at main; its line 11 asks for the ADR-034 docs pull request that appends the acceptance words verbatim, for the human's click. The paragraph's attribution holds.
- `state/directives/2026-10-05-adr-034-acceptance.md` exists at main.
- Pin `state/directives/2026-10-05-adr-034-acceptance.md:6-13 @ a1109023445211651627541a0c1f637690fe2f1d sha256:f3a8c75f9833edef2853331bd70118b460774b26ceb849d44b7f7587984c9485` resolves: a1109023 is the file's adding commit (`git log --diff-filter=A`), is an ancestor of origin/main and of the merge-base, and the span there hashes to the stated value. The reference is contiguous on one line (round 15 (d)) and carries an explicit rev at a commit on main (round 15 (e)).
- The paragraph does not present the section's opening note as a quotation; it states which part of the section the note covers. No claim of a guarantee, limit or measurement is made.

**The gate-1 architect's findings, each against its fix at 0cb22fa3** (report `state/consults/gates/2026-10-05-adr-034-acceptance-words-gate1-architect.md` on main).
- D1 (the section's opening note, now false of the block): fixed. The paragraph adds a sentence limiting that note to the bullets and naming the block as the quotation, citing the note by section, not by line (round 14). The note itself is not edited, which the ADR's append-only status requires.
- D2 (hash reference with no commit): fixed as the finding specified, with the commit taken from the adding commit (verified above), in the pinned contiguous form.

**Rules not engaged.** No code, seam, `pub` item, perf claim, JSON path, CRS or float path. Round 25 item 2: no §7 full form, no scope addition on a standing rule, no `verify-mutation` run, no test-text span, no five-line form. No custodian-authored red-line text: the only red-line text is the human's own words, reproduced exactly.

## Notes (not findings against this diff)

- N1. `verify-quotes` (tool at scripts/plan/verify-quotes.mjs, last changed at f9444a4d99a9087394c55d4b1d4c414a8b11f980, run at head 0cb22fa3) checks this file's hash reference but extracts no verbatim passage from it ("0 checked" when run on the file alone): the fenced block's match to its source is proven by the hash reference plus the `cmp` above, not by the tool's quote pass. Positive control: the same file with the sha256 zeroed fails with one hash-reference error naming line 203 (rc 1); unmodified, it passes (rc 0).
- N2. The section's opening italic note (merged, outside this diff) still carries its hash "at the commit that adds it" with no rev. The architect named it out of scope; it stays so here.

## Process disclosure

Two earlier attempts to write this report through one long shell heredoc did not run, and neither created the file (checked with `ls`): the first was refused by Guardian G1 because the command text contained the publishing word the brief forbids; the second failed to parse in the shell (rc 2). This file was then assembled in the session scratch directory from shorter heredocs and copied here with `cp`; its content is that report with the word removed and this paragraph added.

## Commands (run in the worktree C:/dev/wt/adr034 unless stated; scratch files in the session scratch directory, written as $SP)

| Command | rc |
|---|---|
| `git status --porcelain` (start) — empty | 0 |
| `git rev-parse HEAD` — 0cb22fa39e58c248e307d464b93b9f3acdf596a4 | 0 |
| `git fetch origin` | 0 |
| `git rev-parse origin/docs/adr-034-acceptance-words origin/main`; `git merge-base origin/main origin/docs/adr-034-acceptance-words` | 0 |
| `git diff --stat origin/main...origin/docs/adr-034-acceptance-words` — 1 file, 13 insertions | 0 |
| `git diff origin/main...origin/docs/adr-034-acceptance-words`, piped to `cat -A` | 0 |
| `git diff origin/main...origin/docs/adr-034-acceptance-words -- docs/README.md`, piped to `wc -l` — 0 | 0 |
| `sed -n 206,213p` on the ADR-034 file, to $SP/blk.txt | 0 |
| `git show origin/main:state/directives/2026-10-05-adr-034-acceptance.md`, piped to `sed -n 6,13p`, to $SP/src_main.txt | 0 |
| `git show a1109023445211651627541a0c1f637690fe2f1d:state/directives/2026-10-05-adr-034-acceptance.md`, piped to `sed -n 6,13p`, to $SP/src_pin.txt | 0 |
| `sha256sum blk.txt src_main.txt src_pin.txt` — all f3a8c75f9833edef2853331bd70118b460774b26ceb849d44b7f7587984c9485 | 0 |
| `cmp blk.txt src_main.txt`; `cmp blk.txt src_pin.txt` | 0, 0 |
| `file blk.txt src_main.txt` — ASCII text | 0 |
| `git log --diff-filter=A --format=%H origin/main -- state/directives/2026-10-05-adr-034-acceptance.md` — a1109023445211651627541a0c1f637690fe2f1d | 0 |
| `git merge-base --is-ancestor a1109023 origin/main`; same against 185bd85f | 0, 0 |
| `git rev-parse` of the ADR-034 blob at 185bd85f and at origin/main — both c21a319f | 0 |
| `git diff 4ed2b479 0cb22fa3` (the D1/D2 fix) | 0 |
| `node scripts/plan/verify-cites.mjs` (tool last changed at 522e448d55e089b974e115e23f0c72bfc6e1120a) — PASS | 0 |
| `node scripts/plan/verify-quotes.mjs` (tool last changed at f9444a4d99a9087394c55d4b1d4c414a8b11f980) — PASS, 0 hash-reference errors | 0 |
| `node scripts/plan/verify-test-claims.mjs` — PASS | 0 |
| `node scripts/plan/verify.mjs` (verify:plan; tool last changed at 260720226f136d1ec7d72da64656f07d29400ed7) — PASS | 0 |
| `node scripts/plan/verify-quotes.mjs $SP/adr034-ok.md` — PASS | 0 |
| `node scripts/plan/verify-quotes.mjs $SP/adr034-bad.md` (sha256 zeroed) — FAIL, 1 hash-reference error at line 203 | 1 |
| `gh pr view 179 --json headRefOid,state,isDraft,baseRefName,mergeable` — head 0cb22fa3, OPEN, not draft, base main | 0 |
| `gh pr checks 179` — 6 of 6 pass | 0 |
| `gh run view` for runs 37376934996, 37376939168, 37376939304, 37376939161 — every headSha 0cb22fa39e58c248e307d464b93b9f3acdf596a4, all success | 0 |
| `git status --porcelain` (end) — empty | 0 |

CI on the head 0cb22fa3: Governance CI (both trigger events: cfg boundary; test, verify:plan, queue/site drift), DCO sign-off, Exposure scan — all pass.
