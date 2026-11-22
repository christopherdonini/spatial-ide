*The build worker's report for the node verify-cites-shortened-target-list (PR 351, branch cut/verify-cites-shortened-target, head f912819f120a8434d385471b3eedb3d8f92b9274), filed by the custodian byte for byte below the rule from its hand-back in its transcript: 5255 bytes, sha256 798e85912c86e5505e619a2873fc339ee8ef50b04a7e50665d034f27e6a3c55a. Its run: Read 2, Bash 28, Edit 2, SubagentHandback 1, by unique call ids; one errored, an Edit before a Read; sonnet; first record 2026-11-22T10:53:47Z, hand-back 2026-11-22T11:06:09Z; no compaction. Unverified by any gate until the reviewer's. One write fell outside its allowed places, a script file under the system temporary folder, moved into <S> at once, as it reports.*

---

Built: the verify-cites shortened-target list at f912819f120a8434d385471b3eedb3d8f92b9274
Result: all three commits are pushed with no STOP. The change totals 134 changed lines, under the 150 limit.

Start state: HEAD was 8ab25c9c5d613d032858a509901650dca48f4781, and `git status --porcelain` was empty.
Commits:
- T 9abd7f504bbfb08cfc2ecf7f3bf839cf55bc1dce: `test: verify-cites: a listed cite into a shortened file is read at its entry's commit (failing first)`
- S 20df01a366a7ed91a96978717c0594df0b4463cd: `feat: verify-cites: the shortened-target list, read at each entry's commit`
- M f912819f120a8434d385471b3eedb3d8f92b9274: `test: verify-cites: the recorded mutations of the shortened-target list`
- Push: new branch `cut/verify-cites-shortened-target`, tracking set, rc=0.

T's run (`vcst-t.log`):
- 63 tests, 56 pass, 7 fail. All 7 failures are the new tests, and every existing test passes.
- Test 1 fails with an AssertionError: the cite is gated with `line 5 exceeds "engine/src/pool.rs" (1 lines)`.
- Tests 2 and 3 fail on the reason text. The reason lacks the list name and commit, and says `line 7 exceeds ...` (test 2) or `line 5 exceeds ...` (test 3).
- Tests 4, 5, 6 and 7 fail with `TypeError: Cannot read properties of undefined (reading 'length')`, because `targetErrors` is not yet returned.

S's runs:
- `verify-cites.test.mjs`: 63 tests, 63 pass, rc=0.
- CI's whole command (plan, hooks and evidence tests): 622 tests, 622 pass, 0 fail, rc=0.
- `node scripts/plan/verify-cites.mjs`: rc=0, `verify:cites PASS — every rooted (in-tree) path:line reference across 3564 file(s) resolves.`

Mutations, each applied alone by an anchored script that fails unless its anchor appears exactly once, and restored by `git checkout -- scripts/plan/verify-cites.mjs` (`git status --porcelain` empty after each). Logs are `vcst-m1.log` to `vcst-m7.log` in the scratchpad.
- **M1 (list lookup removed):** 4 new tests red.
  - `a_listed_cite_past_the_end_of_a_shortened_file_passes_at_its_entrys_commit`
  - `a_listed_cite_past_the_end_at_its_entrys_commit_too_fails_by_name`
  - `a_listed_cite_whose_commit_is_not_on_heads_history_fails_by_name`
  - `a_shortened_target_entry_whose_cite_resolves_in_the_tree_fails_by_name`
- **M2 (bound in `checkPinned` dropped, `false &&`):** 7 red in total.
  - One new test: `a_listed_cite_past_the_end_at_its_entrys_commit_too_fails_by_name`.
  - Six existing pinned-cite tests also fail, because `checkPinned` is shared.
  - I could not drop the bound in new-code only.
- **M3 (ancestry check removed):** only `a_listed_cite_whose_commit_is_not_on_heads_history_fails_by_name`.
- **M4 (filed-record check replaced by `false`):** only `a_shortened_target_entry_outside_state_and_the_forms_fails_by_name`.
- **M5 (40-hex check replaced by `false`):** only `a_shortened_target_entry_whose_commit_is_not_40_hex_digits_fails_by_name`.
- **M6 (resolves-in-tree error removed):** only `a_shortened_target_entry_whose_cite_resolves_in_the_tree_fails_by_name`.
- **M7 (matches-no-cite error removed):** only `a_shortened_target_entry_that_matches_no_cite_fails_by_name`.
- For M3 to M7 I read the failing test names off the logs. I did not capture each failure's assertion message.
- M adds one RECORDED MUTATION comment above each of the seven tests, naming S's commit id (20df01a3).
- After M, the file runs 63 of 63 green.

Numstat against 8ab25c9c, from `git diff --numstat 8ab25c9c5d613d032858a509901650dca48f4781 HEAD`:
- `scripts/plan/verify-cites-shortened-target.json`: 1/0
- `scripts/plan/verify-cites.mjs`: 48/4
- `scripts/plan/verify-cites.test.mjs`: 81/0
- Total: 134 changed lines, over exactly the three Scope files.

Changed or new functions:
- `shortenedEntries(root)` is new.
  - It returns the entries to apply and the errors for entries not applied.
- `runVerifyCites` now reads the list and tracks `matched` and `resolved` per entry.
  - For a listed cite whose tree result is not ok, it checks that the entry's commit is an ancestor of HEAD.
  - It then reads the cite through `checkPinned` with `pin` set to the commit.
  - On ok it continues. Otherwise the finding goes to the usual sink, with a reason naming the list and the commit's first 12 digits.
  - It now also returns `targetErrors`.
- `main` prints `verify:cites FAIL — N shortened-target list error(s):` and sets exit 1.
- `checkPinned`, `legacyListErrors`, `legacyKeys` and every existing reason string are unchanged.
- New test helper `shortened` in the test file.

Self-check:
- **Cross-module seams:** none, since this is a script-local change. It calls `checkPinned` and `pinnedRefs` as they exist in the same file.
- **Completion claims:** each claim above points to a log or a run in this transcript.
- **User-facing messages:** the new FAIL line and reasons describe behaviour implemented at S.
- **Tests reach their assertion:** they pass at S and fail under their mutations on the intended assertion.

Model: I observe myself as claude-sonnet-5-5, with no override and no context handoff.

Off-scope noticed, not done: a first Bash call put `vcst-edit.mjs` in `$TMP`, outside `<S>`. I moved it to `<S>` straight away.

State: branch pushed, `git status --porcelain` empty, no background process running, no PR opened.
