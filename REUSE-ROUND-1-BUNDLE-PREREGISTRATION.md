# The reuse archaeology round 1 bundle, placed as it came under `reuse/` — five-line preregistration (`AUTONOMY.md` §21d)

*Committed before the placement commit. Placed by the human's reuse round 1 direction, item 1 (`state/directives/2026-10-08-reuse-round-1.md`), and its v2 archive message (`state/directives/2026-10-08-reuse-round-1-v2.md`), each with its DIRECTIVE block in `DECISIONS-PENDING.md`. The archive reached the session as the human's upload, received at 16:36:01Z by the transcript. A single combined reviewer gate (§21b) applies, because none of §21a's categories is touched. The bundle's own size is declared instead of a line budget, since nothing in it is written in this piece.*

```
Authority: PLAN node reuse-round-1-bundle; the human's reuse round 1 direction, item 1 (state/directives/2026-10-08-reuse-round-1.md), and its v2 archive message (state/directives/2026-10-08-reuse-round-1-v2.md): one docs-and-data piece in slot 2, after #190 merges, not under docs/
Scope: reuse/ only, a new top-level folder holding the 139 files of spatial-ide-reuse-round-1-v2.zip (sha256 50d87a03eb42148608209edbad2d905bcea0e1c369f1d3330f86fb54d2409526) under the archive's own reuse/ folder, byte-identical to the archive; no other file; size 757,418 bytes over 139 files, the archive's own, declared instead of a line budget
Change: the bundle is placed as it came; nothing in it is edited, added or removed; it falls under the repository's core grant (AGPL-3.0-or-later covers every source file outside docs/), as its three tools' SPDX lines state; it adds no mod, pilot, trial or record rule and no dependency; reuse/tools/fetch-cache.mjs is not run, and the clone cache is never inside the repository
Tests+mutation: none, data placed as it came; checked before the PR: the archive's sha256; the repository's profile-path scanner in --staged mode over the placement (with a positive canary first), and a search for references to any project other than Spatial IDE and the third-party repositories it studies; reuse/tools/check-index.mjs exits 0; verify-cites over --files 'reuse/**' and over its default set exits 0 (a flag on a citation inside the bundle stops the piece and goes to the human: no checker change, no exemption, no edit to the notes); verify-quotes, verify-test-claims, verify, queue --check, site --check and cfg-boundary exit 0
Out-of-scope: ADR none (REUSE-ROUND-1.md section 1's ADR-036 findings go to the architect as findings for the human's acceptance sight, not as rulings, outside this piece); security none (nothing in the bundle runs at build, in CI or in the product, and fetch-cache.mjs is not run); wire none; guarantee none -- §21a's four categories untouched, so the single reviewer gate applies; adopting any dependency the bundle names stays the human's typed word
```

## Amendments

Opens empty, append-only.

### Amendment 1 — the size overrun closes the single-gate route (class 6, budget deviation, Scope not edited), and the gate-1 reviewer's record items

*Written by the custodian after the gate-1 reviewer failed the piece on E1 (`state/consults/gates/2026-10-08-reuse-round-1-bundle-gate1-reviewer.md`, gate-log 443), at the branch head 2ae29e9d, with nothing in `reuse/` changed. Correction round 1 of 2. It follows `AUTONOMY.md` §21b's clause on a size overrun found mid-piece: the piece keeps its five-line form and records the overrun here. Nothing below is a quotation.*

1. **The overrun.** The placement holds 366 lines of non-generated code over 3 files, against §21c's bound of 150 lines over at most 8 files:
   - `reuse/tools/check-index.mjs`: 59;
   - `reuse/tools/fetch-cache.mjs`: 198;
   - `reuse/tools/reuse.mjs`: 109.
   - The whole placement is 12,216 lines over 139 files. Code placed as it came is not in the exempt set. The custodian's form was wrong to put a declared size in place of the bound.
2. **The route.** §21a's size trigger applies, so the single-gate route is closed. Both gates apply: the architect gate, and the reviewer gate.
   - The reviewer's gate-1 Correctness verdict stands. A reviewer re-gate reads only this amendment and the records.
   - The Scope line is not edited.
3. **What is unchanged:** nothing inside `reuse/` is edited, added or removed. The Change, Tests+mutation and Authority lines stand.
4. **To the human, not edited in the bundle:**
   - **H1:** the reviewer's local-folder lines. Seven notes give the advisor's clone folder as a tilde path under one research folder, and three lines in the verification notes give a temporary folder. None names an account or another project, and the repository's scanner passes them. The custodian's judgment is that the human's round-27 clarification (a path naming a user profile) does not reach them. The human decides.
   - **Two robustness notes on the bundle's tools:** check-index's final count, and the query tool's loop over a capability's decisions. Each lacks a fallback for an absent array. Both hold on today's index.
5. **The reviewer's D1** is this amendment.

**Superseded index.** The preamble's sentence putting the bundle's declared size in place of a line budget → item 1. The Out-of-scope line's conclusion that the single reviewer gate applies → item 2. Neither is edited.
