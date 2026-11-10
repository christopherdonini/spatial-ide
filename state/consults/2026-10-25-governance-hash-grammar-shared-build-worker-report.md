*Custodian's filing note (2026-10-25): the worker's build of `governance-hash-grammar-shared` on its branch, from main b5e39efd (the form's commit), final head 5a419418; draft PR #256. The custodian's check: the numstat from b5e39efd is 128 lines in the five files the Scope line names, and the worktree is clean. Its writes were inside the worktree's scripts/plan/ and its own scratch files (6 by the write tools); no rebase, reset, PR action or force push. It discloses a word in its first commit's body that the brief's rule on the at sign covers, a reference-grammar token and no address, left as committed since an amend is forbidden; and a node call with an empty argument left waiting on input, which the custodian stopped by its own PID once the worker had stopped. The run 09:08:11Z to 09:23:03Z by its transcript (Read 3, Bash 30, Write 5, Edit 1). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 94e6fe377ae1ba8863f15fbe28a00f51817e94c836b2826ba7de47143927d948.*

---

Built: governance-hash-grammar-shared at 5a4194182e5d8e4db428c23af47e7d8c7f08efbc (pushed; origin/cut/governance-hash-grammar-shared equals HEAD; `git status --porcelain` empty).

Commits (both signed off with -s, on the base b5e39efd):
- 7b380c3b2b092e0dcef33a7babe0617affa18568: code and tests.
- 5a4194182e5d8e4db428c23af47e7d8c7f08efbc: the two RECORDED MUTATION comments, each naming 7b380c3b as the observation commit.

Files:
- scripts/plan/hashRefGrammar.mjs (new, 26 lines): exports `GAP` and the factory `hashRefRegExp({ pathRequired })`, which returns a fresh RegExp each call.
- scripts/plan/verify-quotes.mjs (+5/-9): imports the factory and builds `HASH_REF_RE` with `{ pathRequired: false }`. Three comments now name hashRefGrammar.mjs.
- scripts/plan/verify-test-claims.mjs (+14/-31): imports the factory with `{ pathRequired: true }`. The header and constant comments drop the "DERIVED FROM ... @ 1254cddd" text and say the grammar is imported.
- scripts/plan/README.md (+2/-3): the same sentence rewritten.
- scripts/plan/verify-test-claims.test.mjs (+38): the new `runVerifyQuotes` import, T1, T2 and the two RECORDED MUTATION comments.

Line total: 128 against a budget of 140 (`git diff --numstat b5e39efd...HEAD`, exit 0, only the five files).

`.source` comparison: the one-off, uncommitted `node -e` printed each checker's `.source` and flags at the base, then at HEAD (scratch files under hgs-w-). `diff` of the two outputs: rc=0, identical. The first version of the new module collapsed backslashes in a shell heredoc and the comparison caught it. The module was rewritten with the Write tool before any commit.
- verify-quotes base and head: `(byte-copied from\\s+)?`?(?:([A-Za-z0-9_][A-Za-z0-9_./+-]*))?:(\\d+)(?:-(\\d+))?`?(?:[ \\t]*(?:\\n[ \\t]*\\/\\/[ \\t]?)?[ \\t]*@[ \\t]*(?:\\n[ \\t]*\\/\\/[ \\t]?)?[ \\t]*([^\\s`]+))?[ \\t]*(?:\\n[ \\t]*\\/\\/[ \\t]?)?[ \\t]*sha256:([0-9a-f]{64})`?`, flags g.
- verify-test-claims base and head: the same, except the path group is `([A-Za-z0-9_][A-Za-z0-9_./+-]*)` with no `(?:...)?` around it, flags g.

Mutations: each applied alone to the committed code at 7b380c3b, the two new tests run, then reverted with `git checkout -- <file>` (porcelain clean after each). I did not use `verify-mutation`.
- M1 (`pathRequired: false` in verify-test-claims.mjs): `a_withdrawn_test_row_with_only_a_bare_line_reference_has_no_pinned_reference` failed with actual "refused: another file's path", expected 'refused: no pinned reference'. T2 still passed.
- M2 (rev group becomes `([0-9a-f]{12,40})` in hashRefGrammar.mjs): `a_seven_character_rev_pin_binds_in_both_checkers_through_the_shared_grammar` failed with actual `{ quotes: 1, claims: 0 }`, expected `{ quotes: 0, claims: 1 }`. T1 still passed.
- My first M2 attempt did not apply, because the string match failed, so that run was unmutated and both tests passed. I discarded it, applied M2 with the Edit tool and re-ran.

Checks at the final commit, each with its exit code:
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: exit 0, tests 557, pass 557, fail 0, skipped 0. It ran in the shared hold (granted, then released). No `guardian parity` fixture read `not judged`.
- `node scripts/plan/verify.mjs --offline`: exit 0, PASS.
- `node scripts/plan/verify-cites.mjs`: exit 0, PASS.
- `node scripts/plan/verify-quotes.mjs`: exit 0, PASS (0 hash-reference errors).
- `node scripts/plan/verify-test-claims.mjs`: exit 0, PASS (657 claims).
- Before commit 2, `verify-test-claims.test.mjs` and `verify-quotes.test.mjs` run together: 138 of 138 passed. T1 and T2 passed at the head.

Items to flag:
- Commit 7b380c3b's message body has "path:line @ rev sha256" on line 3. That `@` is not an address, but the brief's rule was no `@` outside the first trailer line. I noticed it after committing and an amend is forbidden. The `@` check I ran on the message file listed that line. Commit 5a419418 has `@` only in the first trailer.
- T2's fixture trips no quote-trigger finding; only `hashFindings` is asserted.
- A first `node` call with an empty argument went to the background and may have left a node process waiting on stdin. It is mine (id bd2qlvm81) and I did not kill it.

Four failure classes:
- Cross-module use: the readers I touched are `extractHashRefs` in verify-quotes.mjs, and `markedSpans` and `firstHashRefsByLine` in verify-test-claims.mjs. They were read in the worktree, and their bodies are unchanged.
- Completion claims: each claim points to a transcript call (the `.source` diff, the numstat, the mutation runs, the suite and verifier runs).
- User-facing messages: none are added or changed.
- Tests reach their assertions: M1 and M2 failed at the intended assertion lines, not at setup.

Caller grep: `grep -n "hashRefRegExp" scripts/plan/*.mjs` shows `verify-quotes.mjs` calling it with `pathRequired: false` and `verify-test-claims.mjs` with `pathRequired: true`. `GAP` is exported but its only user is `hashRefRegExp` inside hashRefGrammar.mjs itself; the form's Change line names the export.

Model: claude-sonnet-5-5 (Sonnet 5.5) as the harness reports it, no override, no context handoff received or produced. No usage figures at hand.
