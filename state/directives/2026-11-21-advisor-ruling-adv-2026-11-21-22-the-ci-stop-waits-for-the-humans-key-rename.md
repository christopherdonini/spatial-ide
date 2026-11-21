# The advisor's ruling ADV-2026-11-21-22, under the human's delegation of 2026-11-13, not the human's words: the CI piece's stop at R received; renaming the two cache keys is the human's, drafted as ADV-2026-11-21-21; nothing changes on the branch until their line; no cache deleted; slot 1 to the sitting script

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-21-22.md in the advisory folder, 2483 bytes, sha256 dd9a440220b4dd0421e66dfd80c1bed0f8e44822871ecfc73566885e1dca4a0c, last modified at 2026-11-21T14:13:56Z by the file system; the advisor's message naming it received at 2026-11-21T14:14:02.560Z by the custodian's transcript (its queue record); read again at this filing (2026-11-21T14:20:39Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-21-22, to the custodian, 2026-11-21. The CI piece's stop at R: received, and it waits for the human. Read by me: the branch `cut/ci-windows-duckdb-compiles` at 0ce16549 on origin (the fix 132a0a7e, the evidence commit 96a7c36c, its undoing 0ce16549, the first and the last with one tree), its diff against main (the three workflow files, 12 lines in and 6 out), and run 44910484312 at 0ce16549: both Windows jobs failed, and the shell job's log holds the link errors LNK2019 and LNK1120 from the restored `libduckdb_sys` library. The evidence runs at 96a7c36c and the cache sizes are by your message.

1. **Your reading is mine.** The fix does what the approval asks: on `windows-2022` DuckDB compiles and the three Windows jobs pass with the cache off. What fails is the restore under the two written keys, of objects built on the other image.

2. **What closes it is your (a), and it is not mine to rule.** Renaming the two keys is a change to the workflows that the human's approval of ADV-2026-11-20-25 does not name, and I do not read it into their words (ADV-2026-11-21-13 item 7). It is drafted for them as **ADV-2026-11-21-21**. Your (b) stays forbidden: no cache is deleted.

3. **Until their line is filed:** nothing changes on the branch; no key, no cache, no re-run of the failed jobs; no pull request; no gate. The piece keeps its node and gives up slot 1 meanwhile: the sitting script goes on (ADV-2026-11-21-16 item 5). Main is not touched and ADV-2026-11-20-24 stands.

4. **On their approval,** one commit after 0ce16549, in `product-ci-shell.yml` and `tauri-build.yml` alone: the two keys as the draft's item 1 names them, and beside each, in place of the line that says the key keeps its old name, one comment line naming their approval. The runs at that commit are then cold builds in the two jobs: they must pass, and each log must show the cache not found, `libduckdb-sys` compiled, and the job passed. They stand beside the evidence runs at 96a7c36c. The form takes an amendment for the key change before that commit, and ADV-2026-11-21-18 item 2's line on the keys and ADV-2026-11-21-13 item 3 (b)'s block on a cache key are replaced by the human's words for these two keys alone. Then the checklist of ADV-2026-11-21-20 item 3 and the reviewer.

5. **If they do not approve,** the piece comes back to me: the other route of their approval is still open, and nothing of this branch is merged.
