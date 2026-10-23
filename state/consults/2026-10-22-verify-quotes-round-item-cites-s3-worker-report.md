*Custodian's filing note (2026-10-22): verify-quotes-round-item-cites's S3 (the docs of §2.8, with Amendment 3's unread block named) by a worker, at b08a1fec on its branch. Its §7 count of 3,652 lines takes B...HEAD across main's merged drift; the piece's own count against the merge-base with main (49a7f532) is 375 lines over 7 files, within 550 and 7, by the custodian's command. The run 12:43:38Z to 13:00:06Z by its transcript (Bash 14, Write 1); its claims were read against that transcript's calls before filing. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is d7d3627847079b97d495256a35117221ca7903ee5272754d0a3270095b012790.*

---

Built: S3 at b08a1fec4e3405153b4998882427355fa18db319 (branch cut/verify-quotes-round-item-cites, parent 8e04dbe2). Three files, 29 insertions, 2 deletions; porcelain clean after commit.

Changed lines as they stand:
- scripts/plan/verify-quotes.mjs: 21 lines added at the end of the header comment, after the DISCLOSED GAPS paragraph and before the imports. They open `// ROUND + ITEM CITES (VERIFY-QUOTES-ROUND-ITEM-CITES-PREREGISTRATION.md §2.1 to §2.4; GATED, citeFindings):`. The paragraph covers the grammar, the ruling set read one file at a time, the block boundary, the item-line rule, the round-file fallback, what is not read, and the `FAIL — ruling cite:` output. Its DISCLOSED GAPS sentence names sub-clauses, entries, clause cites, directive items, bare rounds, files outside the scan set, and existence not meaning. It then names the one unread block: question round 72's header in the 2026-10-20 archive names its round outside the grammar, a cite to it is refused by name, and a record cites that ruling by a hash pin (the form's Amendment 3, item 1).
- scripts/plan/README.md: one section appended at the end, `## \`verify-quotes.mjs\` — round + item cites`. It names `resolveRoundItem(texts, round, item, roundFileText)` in `scripts/plan/rulingSet.mjs`, shared with `verify-test-claims.mjs`' `ledgerRoundItemResolves`. It repeats the disclosed gaps and the round 72 block.
- .github/workflows/governance-ci.yml: two clauses. The step name gains ", and every `round N, item M` cite resolves against the ruling set" before "; recorded baseline entries advisory)". The green-run comment gains two comment lines after "that cannot be fixed in place)." saying that every `round N, item M` cite outside backtick, double-quoted and `> ` text resolves against the ruling set one file at a time, and that the item exists, not what the cite means. The `paths:` filter is untouched.

No governing doc is quoted. Every `round N, item M` I wrote is inside backticks. The round 72 mention carries no item number.

Push: `git push origin cut/verify-quotes-round-item-cites` printed rc=0 (8e04dbe2..b08a1fec), no force.

Checks at b08a1fec (all rc=0):
- verify.mjs: "verify:plan PASS — C:\dev\wt\vqri\PLAN.yaml agrees with the repository."
- verify-cites.mjs: "verify:cites PASS — every rooted (in-tree) path:line reference across 2189 file(s) resolves. (112 loose reference(s) advised above.)"
- verify-quotes.mjs: "verify:quotes PASS — 130 checked, 99 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 836 ruling cites resolved, 0 ruling-cite errors." It ran 4m49s in the foreground. My first run under a 280 s timeout returned rc=124 (timeout, not a failure), so I re-ran it with a 560 s timeout.
- verify-test-claims.mjs: "verify:test-claims PASS — all 613 claimed test(s) across 188 file(s) exist or are planned, superseded or withdrawn (36 planned, 9 superseded, 17 withdrawn, advisory)."
- queue.mjs --check: "queue.mjs --check: CUSTODIAN-QUEUE.md/.json are current."
- site.mjs --check: "site.mjs --check: site/ is current."
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc=0; tests 542, pass 542, fail 0, cancelled 0, skipped 0, todo 0. This matches the 542 in Amendment 1.

§7 count, `git diff --numstat a1bbc81eda83075ee870240ba12738600372de4a...HEAD` (insertions plus deletions): 3652 lines over 38 files, against 550 lines and 7 files. The merge-base with B is B itself, so this range includes main's drift merged into the branch, S1 and S2's report files, and S3. It is not the piece's own count. S3 alone (`git diff --numstat 8e04dbe2 HEAD`) is 31 lines over 3 files. I did not compute a count excluding the merged-in main drift.

Could not do: nothing in scope was left undone. I did not run `verify-mutation` and ran no mutations. I did not run `--show-cites`.

Model: Sonnet 5.5 (claude-sonnet-5-5), as the harness reports it; no override and no context handoff received or produced.

Pre-gate self-check:
- Cross-module use: I read `scripts/plan/rulingSet.mjs` `resolveRoundItem` (lines 84-102 at HEAD) and the cite pass in `scripts/plan/verify-quotes.mjs` (lines 976-996 at 8e04dbe2). The docs state what those do.
- Completion claims: each rests on a command above.
- Messages: the `FAIL — ruling cite:` text in the docs matches the code at `scripts/plan/verify-quotes.mjs` line 1176.
- Required tests: the suite ran to completion, 542 of 542.

Scratch files are in the session scratchpad, all named `vqri-s3-*`.
