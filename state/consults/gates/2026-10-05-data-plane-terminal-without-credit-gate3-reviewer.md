# PR #176 gate 3 — reviewer (scoped)
Reviewed: cut/data-plane-terminal-without-credit @ 1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1 (form at 441848835cc68d7bae1ddb38ad0695fd81488d69)

**Verdict: PASS.** No S1, no S2. Scope (AUTONOMY.md §22): the form's Amendment 5 only, `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:536-543 @ 441848835cc68d7bae1ddb38ad0695fd81488d69 sha256:44df5bcc11371e4af0f59d5afe0d7335b00d02b3460b42a8f54032c504bc5b1d`, read against my gate-2 S1-1 and S2-2 and the architect's gate-2 S1-1 and S2-2. The branch head is unchanged at 1b2e53d4, so gate 2's code result carries forward and no cargo run was made.

## Checks

1. **Append-only.** The numstat of 44184883 on the form is 9 insertions, 0 deletions. The single hunk starts at old line 532 and adds lines 535-543 at the end of the file (the file is 543 lines). The worktree file is byte-identical to the blob at 44184883 (cmp rc 0). Line 536-543 carry no CR byte. Holds.

2. **Item 1 in round 12 (d)'s shape.** Item 1 (`protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:540 @ 441848835cc68d7bae1ddb38ad0695fd81488d69 sha256:f28c22a3ec86ffa1360a359cfea9f3b60d9e750acd1e9800caa65b8457cfffd1`) is three sentences: the defect, the corrected reference, the proof, in that order, with no bold label and no fourth sentence. It carries no characterisation of Amendment 3's hash and no not-created note, the two parts my gate-2 S1-1 and the architect's gate-2 S1-1 found outside the shape. Its only text taken over from Amendment 4 item 1 is the pin, which both gate-2 remedies required as the operative text, so it does not restate an earlier claim. Closes my S1-1 and the architect's S1-1.

3. **Item 1's pin.** It is written contiguous on one line (round 15 (d)) in the form `path @ <rev> sha256:<hex>`. The path and rev are those my gate-2 S1-1 remedy named. Recomputed: `git show 8f4874c184ac4b4d13546b47843c643e1fcdb5ec:state/consults/2026-10-05-data-plane-terminal-without-credit-worker-report-1.md | sha256sum` gives d58d34f9d1ce6c0d284733d3b1e25a042d04e320290a5cae96a43109dd43d86a, equal to the pin's hex and to my gate-2 recompute. 8f4874c1 is an ancestor of origin/main (round 15 (e)), and 44184883 does not create it. The file is tracked. The proof sentence names the gate-2 reviewer's recompute: my gate-2 report records it under its Amendment 4 section, item 1. It resolves.

4. **Item 2's id.** Item 2 (`protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:541 @ 441848835cc68d7bae1ddb38ad0695fd81488d69 sha256:7ff37871ab2665ed449a82a1f28a6e139d86a900fb236bba66d79639094ea6a8`) names 1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1 in full. That equals the PR head (`gh pr view 176`, headRefOid), origin's branch ref, and the commit my gate-2 report checked (its Reviewed line). Its parent is 3f7b1949, the gate-1 head, and its subject is the gate-1 correction. Amendment 4 items 3, 4 and 5 are the three that say the branch fix commit, so the item's range is right. Closes the architect's S2-2.

5. **Superseded index.** Line 543 (`protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:543 @ 441848835cc68d7bae1ddb38ad0695fd81488d69 sha256:ca2ca79d974a2db59e681819aff7bf46f23398ea3a4729bc21ab985827301058`) has two entries. The first names Amendment 4 item 1 as superseded by item 1, with the pin carried unchanged: this is the architect's gate-2 remedy, Amendment 4 item 1 except that pin. The second names the data-plane half of §2 Part 4's owner's-index bullet as superseded by Amendment 4 item 6: this is my gate-2 S2-2 entry. Round 12 (e) holds for the round. Closes my S2-2.

6. **Other rules over the added text.** The preamble cites both gate-2 reports by path, both tracked on main, with no line cite. Amendment 5 has no `:line` cite into the form or any other file. It contains no quotation and states that. There is no discharge clause to resolve.

## Findings

- None at S1 or S2.
- N-1. Item 2 is a branch commit id, carried in an append-only record without a hash. Round 15 (e) binds hash references, and item 2 carries none. Round 25, item 2 (d) has branch commits named by id until the merge. This repository merges PRs with merge commits (origin/main's last five merges: #175, #174, #173, #172 and a main sync), so 1b2e53d4 will be reachable from main once the PR merges. No action.
- N-2. Gate-2 residues outside Amendment 5 are not re-gated here: my S2-1, the architect's S2-1, and the architect's N-3 (Amendment 4 item 2's pin as one line). Both gate-2 reports send them to the closing record.

## CI

`gh pr checks 176`: rc 0. All 16 checks pass on 1b2e53d4, among them cargo test --workspace on windows-latest and ubuntu-24.04, cargo fmt --check, the cfg boundary, every commit signed off, no profile path in the range, tauri build, verify:plan with queue/site drift, and typecheck, build, vitest and cargo test.

## Commands (main checkout, read-only; exit codes)

- `git rev-parse HEAD` → 441848835cc68d7bae1ddb38ad0695fd81488d69, rc 0
- `git rev-parse origin/main` → 441848835cc68d7bae1ddb38ad0695fd81488d69, rc 0
- `git diff --numstat 441848835cc68d7bae1ddb38ad0695fd81488d69^ 441848835cc68d7bae1ddb38ad0695fd81488d69 -- protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md` → `9	0`, rc 0
- `git diff 441848835cc68d7bae1ddb38ad0695fd81488d69^ 441848835cc68d7bae1ddb38ad0695fd81488d69 -- protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md` → one hunk at @@ -532,3 +532,12 @@, additions only, rc 0
- `git show 8f4874c184ac4b4d13546b47843c643e1fcdb5ec:state/consults/2026-10-05-data-plane-terminal-without-credit-worker-report-1.md | sha256sum` → d58d34f9d1ce6c0d284733d3b1e25a042d04e320290a5cae96a43109dd43d86a, rc 0,0
- `gh pr view 176 --json headRefOid,headRefName` → cut/data-plane-terminal-without-credit, 1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1, rc 0
- `gh pr checks 176` → 16 pass, rc 0
- `git rev-parse origin/cut/data-plane-terminal-without-credit` → 1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1, rc 0
- `git merge-base --is-ancestor 8f4874c184ac4b4d13546b47843c643e1fcdb5ec origin/main` → rc 0 (on main)
- `git merge-base --is-ancestor 1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1 origin/main` → rc 1 (branch only, as expected before the merge)
- `git log -1 --format='%H %P %s' 1b2e53d4f9e8532fc46cc003c7555a5b5e907ea1` → parent 3f7b19492cf9df9fa076d84207031c337ac0464a, rc 0
- `git ls-files --error-unmatch` on the worker report 1 and both gate-2 reports → all three tracked, rc 0
- `git log --merges --oneline -5 origin/main` → merge commits, rc 0
- `git show --stat 441848835cc68d7bae1ddb38ad0695fd81488d69` → the form at 9 insertions among 11 files, rc 0
- `nl -ba` on the form, lines 534-545 → Amendment 5 at 536-543, rc 0; `wc -l` → 543, rc 0; `file` → UTF-8 text, no CRLF note, rc 0
- `sed -n '536,543p'` on the form `| tr -cd '\r' | wc -c` → 0, rc 0,0,0. An earlier `od -c | grep -c` count was malformed (the shell collapsed the backslash in the pattern) and is void; the tr count replaces it.
- `git show 441848835cc68d7bae1ddb38ad0695fd81488d69:<form> | cmp - <form>` → rc 0
- `git show 441848835cc68d7bae1ddb38ad0695fd81488d69:<form> | sed -n '<a>,<b>p' | sha256sum` for 536-543, 540, 541 and 543 → the four hashes above, rc 0
