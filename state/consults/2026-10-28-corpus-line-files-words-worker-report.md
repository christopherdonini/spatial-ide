*Custodian's filing note (2026-10-28): the worker's report on PR #267's words commit (the human's licence cell; the licence sources' URLs and times, from the form's Amendment 3; LF-1 in a local-only list by name; the architect's D-1 and D-2), applied by script from the custodian's pair file. The custodian's check by git: the head f3962416 equals origin's branch, one commit after e834dcf7, its diff 7 3 engine/compat-corpus/LICENCES.md; 1 1 engine/compat-corpus/RECORD.md; 1 1 engine/tests/line_corpus.rs; the two LF-1 sections at the head shown to the human byte for byte and sighted (`state/directives/2026-10-28-8a-lf1-sighted-the-licence-row-and-the-record-entry-at-f3962416.md`). By its transcript: 1 cargo call(s), 0 outside a shared hold by command text; 2 git writes. The run 18:22:12Z to 18:32:11Z (Read 3, Bash 15, Write 3). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 6644094ecb25e1c5599a965f74d779ab955612bda1d5023b7da01c18fb46d6aa.*

---

Applied: corpus-line-files gate 1's words at f3962416a59531bcfd2f4354f592e500b920a8da

Brief sha256 04cb87d47079233aa3a551e00d8c9c5203aa166d205c706a3ca58d3363213855. Pair file sha256 2f18f98097d559571bad7c013342a9deb1bfe884a0bb37679207d13f3cd56a01. Both match what the brief gives.

Start state: HEAD, origin's branch and the pair's base all equal e834dcf7…; porcelain was empty.

Edits (one node script, which applies them in order and refuses a block that does not match exactly once):
- LICENCES.md, the LF-1 row: 1 old line, 1 match, new block byte-equal to the pair file.
- LICENCES.md, the S8/S9 rows plus the new local-only list: 2 old lines, 1 match, byte-equal.
- RECORD.md, the LF-1 row: 1 old line, 1 match, byte-equal.
- line_corpus.rs, the comment: 3 old lines, 1 match, byte-equal.

Diff numstat: LICENCES.md 7/3, RECORD.md 1/1, line_corpus.rs 1/1. The `git diff` showed only those blocks. In the commit, `git show --stat` gives 9 insertions and 5 deletions over three files.

Checks, each with its exit code:
- `cargo test -p spatial-engine --test line_corpus -- --ignored` ran inside a shared hold. rc 0; last test line: "test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.12s".
- `cargo fmt --all -- --check`: rc 0, no output.
- RECORD's LF-1 verify, with CORPUS set as the brief says: rc 0; printed "row true disk true".
- RECORD's C4(a): rc 0; printed "rows 21 disagree 0".
- LICENCES.md has 115 lines, within the 130 limit. Its last line is the sighting line, and `cmp` against the base's last line returned 0.
- `verify.mjs --offline`: rc 0, "verify:plan PASS".
- `verify-cites.mjs`: rc 0, "PASS — every rooted (in-tree) path:line reference across 2474 file(s) resolves".
- `verify-quotes.mjs`: rc 0, "PASS — 131 checked, 100 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 884 ruling cites resolved, 0 ruling-cite errors". It ran past 180 s, so the harness moved it to the background.
- `verify-test-claims.mjs`: rc 0, "PASS — all 690 claimed test(s) across 211 file(s) exist or are planned, superseded or withdrawn".

Hold lines (my project's only, `also=` segment elided):
- MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:14272
- MACHINE_RELEASED project=SpatialIDE shell=bash.exe:14272 affinity=FF (cores 0-7)

Commit: `git add` by path, then `git commit -s -F`, with the brief's subject. The message file has `@` only in its first trailer line (grep showed line 5 only). `git show` after the commit shows the commit carries the `-s` sign-off line. Pushed to origin/cut/corpus-line-files in its own call, rc 0. After the push, HEAD and origin's branch are both f3962416a59531bcfd2f4354f592e500b920a8da, and `git status --porcelain` is empty.

No PR action was taken. Nothing is off-scope. My scratch files are all under `lf1w-` names.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5).
