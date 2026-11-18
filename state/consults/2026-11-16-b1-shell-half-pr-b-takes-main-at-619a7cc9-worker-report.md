# b1-shell-half PR B (PR 327): PR B takes main at 619a7cc9 (ADV-2026-11-16-05 item 3), merge commit 6f95993e; the worker's report

*Filed by the custodian from the hand-back: 1508 bytes, sha256 18eadb239c0ff96921447f48f69bacf855c5abeb8f95ffc828567a6c4c072734, claude-sonnet-5-5, 9 calls by its transcript. Byte for byte below the rule.*

---

Merged: PR B takes main at 6f95993e37255513bf7f5d78b519bc3a71562fb0
- Brief: 6647 bytes, read whole.
- Start state: HEAD 2f704773…, origin/cut/b1-shell-half-pr-b the same after fetch (rc 0). Commit 619a7cc9 is type `commit` and an ancestor of origin/main (rc 0). Porcelain empty.
- Resolution file: 182635 bytes, sha256 ae6a62ddcc9ca23fbf38721a92d5037b285d20e35ca3e0e98fc347bcf7ebabc1. Both match the brief.
- Merge: rc 1. "Auto-merging KNOWN-LIMITATIONS.md / CONFLICT (content): Merge conflict in KNOWN-LIMITATIONS.md". After it, the only unmerged path was `UU KNOWN-LIMITATIONS.md`.
- After `cp` (rc 0): 182635 bytes, sha256 ae6a62dd…ebabc1, equal to the brief. After `git add` (rc 0): 0 unmerged paths.
- Path checks, `comm -3` empty on both:
  - (a) staged against 2f704773 vs main's own changes since 2abf3ea0: 72 vs 72.
  - (b) staged against 619a7cc9 vs PR B's own paths: 57 vs 57.
- Commit message: the only `@` was in the Co-Authored-By line. Commit rc 0, id 6f95993e37255513bf7f5d78b519bc3a71562fb0, parents 2f704773… then 619a7cc9…. `git show HEAD:KNOWN-LIMITATIONS.md | sha256sum` = ae6a62dd…ebabc1. Porcelain empty.
- Push: rc 0, `2f704773..6f95993e cut/b1-shell-half-pr-b -> cut/b1-shell-half-pr-b`. After a fetch, origin/cut/b1-shell-half-pr-b equals HEAD (6f95993e…) and the porcelain is empty. I did not wait for CI.
- Background shells left: none.
- Model: claude-sonnet-5-5 (Sonnet 5.5), as the harness reports it.
- Off-scope: none noticed. The scratch files are `<S>/m4bm-*`.
