# The 1 MiB read node's worker report: built at 536e664d, both tests' mutations observed, E1 to E3 at the head

*Filed by the custodian by script from the worker's transcript: its hand-back, 3955 bytes, sha256 6a996f74615e07192be6e947b7df61dfae003c7be1db386e80db7f368f17f0ec, received at 2026-11-15T08:57:55Z by the custodian's transcript; the run 2026-11-15T08:34:20Z to 2026-11-15T08:57:55Z, 41 tool calls (24 Bash, 9 Edit, 7 Read, the hand-back), model claude-sonnet-5-5. Three tool errors, none of which changed a file: two Edits before their Read, one in each tool, both at 2026-11-15T08:43:01Z, which the report does not state; and an Edit of verify-quotes.mjs on an anchor not found, at 2026-11-15T08:43:07Z, which it states. It was dispatched at 2026-11-15T08:34:19Z by the custodian's transcript, in the background, on its brief in the custodian's scratch folder (11459 bytes, sha256 53a29b9ead72147d54a9c27299dffd6ea9de9ad583d415322eaf05f165f9bae4), which the prompt names. Nothing is changed but a final newline added. The text below the rule is the report.*

---

Done: verify-quotes-and-docsonly-read-files-over-one-mebibyte pushed at 536e664dfc5b6296148e951896025516b71648bb

- Start state: HEAD 5ed2d5037d1c4ac37b17946405050e60b2822757, status clean, branch as given; each checked in its own call.
- S0: the only open PR is #324 (cut/port-2-macos-l1-and-app-dirs, draft). Its diff against main names scripts/plan/cfg-boundary.mjs and .test.mjs plus engine, kernel and other files, and none of section 7's four paths.
- Step 0: exit 0. PASS line: `verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 936 ruling cites resolved, 0 ruling-cite errors.`
- Step 1: numstat `1 1` for each tool. The only change in each is `maxBuffer: 1 << 28` as the last option (after `stdio` in gitShowFile, after `encoding` in gitShow).
- Commits:
  - A = e46167d52fee65ef2260e5a51e1856ac4946605c, `fix: verify-quotes and the docs-only tool read a file over one mebibyte through git`, 4 files, 2026-11-15T09:44:18+01:00.
  - B = 536e664dfc5b6296148e951896025516b71648bb, `test: the recorded mutations of the two tests for reads over one mebibyte`, the 2 test files, 2026-11-15T09:45:06+01:00.
- Step 4, mutations applied alone at A, each a one-line diff, each run by name with exit 1:
  - M1 (`maxBuffer` removed from gitShowFile) failed at assertion (2): `AssertionError [ERR_ASSERTION]: [{"relPath":"A.md","line":1,"reason":"unresolvable rev \"6df3c52bab5db6040492aca0a59028f6ca22085f\" for \"T.md\" -- git show failed"}]`, then `1 !== 0`.
  - M2 (removed from gitShow) failed at assertion (2): `AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:`, the actual array holding `'governance/PLAN.yaml: added or deleted — not a mechanical docs-only change'`, expected `[]`.
  - Each reverted with `git checkout -- <tool path>`; `git diff` was empty (0 bytes) afterwards.
- Step 6 checks at B, all exit 0:
  - C1 `ONE-LINE-OK`; C2 `PATHS-OK`.
  - C3 `{"scripts/plan/docsOnly.mjs":[1,1],"scripts/plan/docsOnly.test.mjs":[41,0],"scripts/plan/verify-quotes.mjs":[1,1],"scripts/plan/verify-quotes.test.mjs":[12,0]} total 57`, then `APPEND-OK`.
  - Section 7 count: 1/1, 41/0, 1/1, 12/0, total 57 (ceiling 80); each tool 1 and 1, no test-file deletions.
  - Both tests by name pass.
  - `node --test` suite: tests 606, pass 606, fail 0.
  - verify-cites PASS; verify-test-claims PASS (812 claimed); verify.mjs --offline PASS; forms-layout PASS.
  - verify-mutation: `all 2 new test(s) have a recorded mutation naming them`.
  - Head `verify:quotes` exit 0, and `cmp` of the base and head PASS lines is 0 (byte-identical).
- E1 to E3 at the head, all as section 5 predicts:
  - E1 exit 0, PASS with 0 hash-reference errors.
  - E2 exit 0, PASS.
  - E3 exit 0: `docsOnly: eligible for delegation — 8faccf8958016e0d39095d8e53de1d8588623060..9c7a187b7c2497617f96c0174043706f0a7aa95f is mechanically docs-only.` No PLAN.yaml line and no other offending line.
- Push: `git push -u origin cut/verify-quotes-and-docsonly-read-files-over-one-mebibyte` created the remote branch. Nothing of mine is left running.
- Departures:
  - C1 to C3 were byte-copied from the form with `sed -n '<line>p'` into script files, not written with the Write tool.
  - One Edit of verify-quotes.mjs failed on an over-long anchor and changed nothing; I retried with a shorter anchor.
  - Three foreground commands exceeded their limit and moved to the background, once during step 0. Each ran once, none repeated.
  - I used bounded wait-loops with `sleep 2`; none was refused.
- Self-check:
  - Interfaces: the tests use the real exports runVerifyQuotes and checkDocsOnly and the existing helpers.
  - Completion claims: each has a call behind it.
  - User-facing messages: none added.
  - Tests: both reach assertion (2), as the mutation runs show.
- Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
