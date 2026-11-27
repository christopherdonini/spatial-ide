# The C1 piece's E-R1 corrected under ADV-2026-11-27-31, with the README section, S-R2's comment and the conformance README, the worker's report

*Filed by the custodian, 2026-11-27. Phase 2 of the correction under `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-31-both-e2e-steps-corrected-before-the-port-textid-d-and-e-r1-no-gate-runs-again-the-readme-section-replaced-whole.md`: the one correction commit of text-id-reopen-with-a-recorded-declaration in D:/wt/c1rd, from b018f9145cdc313cc827f4c122386edfa552717b to f7770e1aa225b7902ea56a77c0d0dbd8321fb942. A sonnet worker (worker-high) made it, with no app, dev server or e2e suite started. Its run, from its completion notice only (ADV-2026-11-26-02), was 38 tool uses. Its report reached the custodian as one hand-back message. Below the rule is that message, saved by Write with the harness's indent removed (10202 bytes, sha256 cb4f7fb0efd6d1e3d9279e1fde15c90f202801d059023655357a6e4189fe9746), byte for byte. Its account is the worker's.*

---

f7770e1aa225b7902ea56a77c0d0dbd8321fb942 is pushed and origin/cut/text-id-reopen-with-a-recorded-declaration reads the same. Every step completed and every check passed. Nothing was run in the app, and the pull request is untouched.

COMMIT: f7770e1a, "test: text-id-reopen-with-a-recorded-declaration's E-R1 waits for each close before its reopens, with the README section, S-R2's comment and the conformance README under ADV-2026-11-27-31".
- 4 files, 17 insertions and 13 deletions.
- It was made with `git commit -s`. Git added its Signed-off-by line, which carries the git user's address from the config. I typed none and put no email in the message text.
- The trailers are the Claude-Session line first and the Co-Authored-By line from your brief last, then the Signed-off-by. Your brief and the harness reminder differed on the ending, so I kept the Co-Authored-By line last of mine.

SCRIPT CHECKS (D:/wt/c1rd-logs/fix31b-apply.mjs, output in D:/wt/c1rd-logs/fix31b-apply.log)
- Before the start: HEAD equalled b018f9145cdc313cc827f4c122386edfa552717b and the origin branch, and the porcelain was empty.
- The script reads the ruling and the architect's read part from `git show origin/main` copies in the logs folder, and slices them by fence lines. All checks ran before any write, and all passed:
  - Both sources have no CR.
  - Item 6 has exactly one "`````text" line and one "`````" line. Its section starts at the heading and ends with one LF.
  - Item 5 has one "````text" fence, one Old and one New line, and one new line beginning with two spaces and "//".
  - F4 was found once. Its Old and New fences were located, and its Old stands exactly once in the conformance README.
  - The e2e README is LF only and ends with one LF. The heading stands once, and no level-1 or level-2 heading follows it, so it is the last section.
  - fixtures.test.ts is LF only, and S-R2's Old stands exactly once. Exactly one line ends "tells them apart." and it is indented two spaces then "//".
  - The conformance README is LF only.
- After the write: 3 files written, no CR in any, and the e2e README still ends with one LF.
- The step and its doc comment in admission-remediation.mjs are my edit, in my own words. The file has no CR.

THE STEP (TEXTID-C1 in frontends/shell/e2e/admission-remediation.mjs)
- Step (3) now begins with `await openAnotherAndWaitForClose(page, "TEXTID-C1 (3)", FIXTURE_NO_ID_COLUMN)`. The control follows unchanged.
- Step (4)'s open was an inline `openPath` with its own `admitted` check. I replaced it with `await openAnotherAndWaitForClose(page, "TEXTID-C1 (4)", FIXTURE_NO_ID_COLUMN)`, then `rmSync(first)`.
  - The function makes the same `openPath` call and the same `admitted` check, with the same message text, since the step id it is given reads "TEXTID-C1 (4)".
  - After the open it waits for the new `close_dataset` row at `ok`.
- The steps keep their numbers, and step (5) is unchanged.
- No assertion was removed or loosened, and the reopen is not retried.
- The step's doc comment and its pass note follow the new acts.

CLAUSE-BY-CLAUSE AGAINST ITEM 6: every clause matches the corrected step. No clause is out of line.
- The step is TEXTID-C1, after TEXTID' and before DUPKEY' (the run list sits at lines 1213 to 1215).
- Its opens and its save go through `openPath`, `e2eSaveProjectToFolder` and `e2eOpenProjectFolder`. Each choice is a click on the page's button, and the field rows and owner line come from `readRefusal`.
- Each close wait is for a new `close_dataset` row at `ok` in the Console, with a request not read before the open. The function's own doc names `reopen.mjs`'s R5 as its model.
- (1): the refusal, the click, and the save to a scratch folder.
- (2): the copy, with the one line `"identity": null` replaced by three lines recording `{"column": "id"}`, in the writer's layout.
- (3): `no-id-column.parquet` is opened first and the step waits for the close of (1)'s open. The control then expects `engine.identity_unusable`, the field row `identity_source` reading `file:id`, and the choice offered, and a click opens it with the choice's line.
- (4): `no-id-column.parquet` is opened again and the step waits for the close of the control's open. Then the first folder is removed.
- (5): `e2eOpenProjectFolder` must answer `engine.identity_unusable` at its first call. `question` and `skp.project_open_elsewhere` fail the step by name. The step also checks column `id`, `identity_source` `mapped:id`, the owner line equal to the R-ENG copy, and that no choice is offered.
- The exit code 0 or 1, and the "operator-run, not in CI or in `npm run verify`" clause: `e2e:admission` is in package.json, it is not in `verify`, and a grep of `.github` finds no reference.
- "What it proves not": M-RD8 is the step's own mutation and is not observed.

CHECKS at f7770e1a
1. `node --check` of admission-remediation.mjs: rc 0.
2. §7's counting command, with the form, PLAN.yaml, the CUSTODIAN-QUEUE files, site and state excluded, from 2df8b4ae to f7770e1a:
   - **Total:** 866 insertions and 132 deletions, which is 998 changed lines over 39 files, against §7's 900 and 50. This is class 8 again.
   - **Merge's own range:** `git diff --numstat 2df8b4aeeba1d3820ec0ba9e9f2bcd4ee7338a3e b7a3dae6b9f5c29262bc7472b1b4f1bd8ca024d2` gives 71 insertions and 4 deletions, which is 75 lines in 2 files. The two lines are `1 1 frontends/shell/e2e/README.md` and `70 3 frontends/shell/e2e/admission-remediation.mjs`.
   - **Counted out by subtraction:** 998 minus 75 is 923. The custodian should confirm that figure by ranges, because I did not.
   - The correction commit alone is 17 insertions and 13 deletions, 30 lines over 4 files.
   - Full --numstat at the head, every line (also in D:/wt/c1rd-logs/fix31b-numstat.txt):
```
5	1	engine/src/dataset.rs
16	8	engine/src/error.rs
6	4	engine/src/identity.rs
1	0	engine/tests/identity.rs
142	0	engine/tests/identity_refusal_names_its_source.rs
2	0	frontends/shell/MANUAL-WALKTHROUGH.md
15	1	frontends/shell/e2e/README.md
176	4	frontends/shell/e2e/admission-remediation.mjs
15	1	frontends/shell/src/admission/AdmissionPanel.test.ts
3	1	frontends/shell/src/admission/AdmissionPanel.tsx
2	2	frontends/shell/src/admission/RefusalBlock.test.tsx
6	6	frontends/shell/src/admission/admitDataset.test.ts
1	1	frontends/shell/src/project/saveProject.test.ts
16	1	frontends/shell/src/skp/__tests__/fixtures.test.ts
5	5	frontends/shell/src/skp/client.test.ts
1	1	frontends/shell/src/skp/types.ts
4	0	kernel/src/skp.rs
249	0	kernel/tests/text_id_reopen_recorded_declaration.rs
18	5	protocol/skp/SKP-V0.md
6	1	protocol/skp/src/v0/mod.rs
7	0	protocol/skp/tests/conformance/README.md
25	25	protocol/skp/tests/conformance/fixtures/refusals-any-layer.json
24	24	protocol/skp/tests/conformance/fixtures/refusals-at-deserialize.json
20	20	protocol/skp/tests/conformance/fixtures/requests-accept.json
1	1	protocol/skp/tests/data/v0-cancel-request.json
1	1	protocol/skp/tests/data/v0-close_dataset-request.json
1	1	protocol/skp/tests/data/v0-describe-request.json
10	0	protocol/skp/tests/data/v0-error-identity_unusable-declared.json
2	1	protocol/skp/tests/data/v0-error-identity_unusable-with-candidates.json
1	1	protocol/skp/tests/data/v0-open_dataset-request-set-aside.json
1	1	protocol/skp/tests/data/v0-open_dataset-request-with-crs_assertion-and-identity.json
1	1	protocol/skp/tests/data/v0-open_dataset-request.json
1	1	protocol/skp/tests/data/v0-record_step-request-filter-apply.json
1	1	protocol/skp/tests/data/v0-record_step-request-style-set-fill-match.json
1	1	protocol/skp/tests/data/v0-record_step-request-style-set.json
1	1	protocol/skp/tests/data/v0-viewport_query-request-with-columns.json
1	1	protocol/skp/tests/data/v0-viewport_query-request-with-filter.json
1	1	protocol/skp/tests/data/v0-viewport_query-request.json
77	8	protocol/skp/tests/fixtures.rs
```
3. In a shared hold, at the root: `cargo test --locked -p spatial-engine -p spatial-kernel -p spatial-skp` rc 0, with 1122 passed, 0 failed and 69 ignored over 129 result lines (my sum of the log's result lines). `cargo fmt --all -- --check` rc 0 with empty output.
4. In a shared hold, in frontends/shell: `npm run typecheck` rc 0. `npm test` rc 0: Test Files 132 passed (132), Tests 1699 passed (1699).
5. Light checks, all rc 0:
   - verify-cites: "verify:cites PASS — every rooted (in-tree) path:line reference across 3811 file(s) resolves. (240 loose reference(s) advised above.)"
   - verify-quotes: "verify:quotes PASS — 161 checked, 130 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 948 ruling cites resolved, 0 ruling-cite errors."
   - verify-test-claims: "verify:test-claims PASS — all 971 claimed test(s) across 300 file(s) exist or are planned, superseded or withdrawn (66 planned, 16 superseded, 17 withdrawn, advisory)."
   - verify-mutation (base 2df8b4ae, head HEAD): "verify:mutation PASS — all 8 new test(s) have a recorded mutation naming them."
   - verify.mjs: "verify:plan PASS — D:\wt\c1rd\governance\PLAN.yaml agrees with the repository."
   - `node --test` over scripts/plan, scripts/hooks and scripts/evidence: 623 tests, 623 pass, 0 fail.
- Logs are in D:/wt/c1rd-logs/ under names containing fix31b.
- `git status --porcelain` is empty at the pushed head.

DEPARTURES AND NOTES
- I read `.claude/agents/worker.md` from the worktree copy at D:/wt/c1rd, not the main checkout, because your brief forbade opening the main checkout.
- The doc comment of `openAnotherAndWaitForClose` (text-id's code, outside the step) still says "Callers: `TEXTID'` (d), and the C1 piece's `TEXTID-C1` (3) and (4) once that branch has this function." That is now true as written. I left it, since the brief limits the commit to the four things.
- The step's wording, its doc comment and its pass note are mine. The README section, S-R2's Old, New and new line, and F4's pair are script-copied from the filed ruling and read part.
- No clippy and no mutation were run, as ordered. No app, dev server or e2e suite was started.
- Disk before the heavy runs: C: 41707 and 41860 MB free, D: 28647 and 28683 MB. Both stayed above their floors.
