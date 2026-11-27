# The C1 piece's words commit under ADV-2026-11-27-30, the worker's report

*Filed by the custodian, 2026-11-27. The words commit of text-id-reopen-with-a-recorded-declaration, made in D:/wt/c1rd from 1a4b5bbe2d77352925238fd934c453cf9e0d0348 to 97019e9198a9a2d110d0d686ce8166574547d4ce. A sonnet worker (worker) made it, with no app, dev server or e2e suite started. Its run, from its completion notice only (ADV-2026-11-26-02), was 26 tool uses. Its report reached the custodian as one hand-back message. Below the rule is that message, saved by Write with the harness's indent removed (5591 bytes, sha256 a44f6eb72d3c3bb4d271f7b87702d44455cce9873c37164ad94a9980a0cf5bea), byte for byte. Its account is the worker's.*

---

Pushed head: 97019e9198a9a2d110d0d686ce8166574547d4ce (origin matches HEAD). Every step completed.

Commit: 97019e91 "docs: text-id-reopen-with-a-recorded-declaration's words under ADV-2026-11-27-30 (row AH8 and its result-log line, and the e2e README's recorded-declaration section)". It was made with `git commit -s`, and the working tree is clean.

Script (D:/wt/c1rd-logs/words30-apply.mjs, output in words30-apply.log), run on the ruling's bytes from git show, saved at D:/wt/c1rd-logs/words30-ruling.md:
- Before the change: ruling has no CR; its fences are 3 (4-backtick at lines 22 and 26, 5-backtick at line 47), in that order. Exactly one "| AH7 " line (2150) and one "- **AH7 (for each" line (2166). None of the three texts were already present. Both files LF only, and the README ends with a single LF.
- After the change: each text occurs once (1 1 1). The line after "| AH7 " is row AH8, and the line after "- **AH7 (for each" is the result-log line. The README ends with the section, preceded by the old bytes plus one LF.
- Diff: `git diff --numstat 1a4b5bbe HEAD` gives MANUAL-WALKTHROUGH.md 2/0 and e2e/README.md 14/0. That is 16 insertions, no deletions. The diff adds no tab and no CR.

§7 count (§7's counting command, from 2df8b4ae to 97019e91, with the form, PLAN.yaml, CUSTODIAN-QUEUE.*, site/** and state/** excluded): insertions 791, deletions 128, total 919, files 39. The full --numstat is in D:/wt/c1rd-logs/words30-numstat.txt:
5 1 engine/src/dataset.rs
16 8 engine/src/error.rs
6 4 engine/src/identity.rs
1 0 engine/tests/identity.rs
142 0 engine/tests/identity_refusal_names_its_source.rs
2 0 frontends/shell/MANUAL-WALKTHROUGH.md
14 0 frontends/shell/e2e/README.md
104 1 frontends/shell/e2e/admission-remediation.mjs
15 1 frontends/shell/src/admission/AdmissionPanel.test.ts
3 1 frontends/shell/src/admission/AdmissionPanel.tsx
2 2 frontends/shell/src/admission/RefusalBlock.test.tsx
6 6 frontends/shell/src/admission/admitDataset.test.ts
1 1 frontends/shell/src/project/saveProject.test.ts
15 1 frontends/shell/src/skp/__tests__/fixtures.test.ts
5 5 frontends/shell/src/skp/client.test.ts
1 1 frontends/shell/src/skp/types.ts
4 0 kernel/src/skp.rs
249 0 kernel/tests/text_id_reopen_recorded_declaration.rs
18 5 protocol/skp/SKP-V0.md
6 1 protocol/skp/src/v0/mod.rs
6 0 protocol/skp/tests/conformance/README.md
25 25 protocol/skp/tests/conformance/fixtures/refusals-any-layer.json
24 24 protocol/skp/tests/conformance/fixtures/refusals-at-deserialize.json
20 20 protocol/skp/tests/conformance/fixtures/requests-accept.json
1 1 protocol/skp/tests/data/v0-cancel-request.json
1 1 protocol/skp/tests/data/v0-close_dataset-request.json
1 1 protocol/skp/tests/data/v0-describe-request.json
10 0 protocol/skp/tests/data/v0-error-identity_unusable-declared.json
2 1 protocol/skp/tests/data/v0-error-identity_unusable-with-candidates.json
1 1 protocol/skp/tests/data/v0-open_dataset-request-set-aside.json
1 1 protocol/skp/tests/data/v0-open_dataset-request-with-crs_assertion-and-identity.json
1 1 protocol/skp/tests/data/v0-open_dataset-request.json
1 1 protocol/skp/tests/data/v0-record_step-request-filter-apply.json
1 1 protocol/skp/tests/data/v0-record_step-request-style-set-fill-match.json
1 1 protocol/skp/tests/data/v0-record_step-request-style-set.json
1 1 protocol/skp/tests/data/v0-viewport_query-request-with-columns.json
1 1 protocol/skp/tests/data/v0-viewport_query-request-with-filter.json
1 1 protocol/skp/tests/data/v0-viewport_query-request.json
77 8 protocol/skp/tests/fixtures.rs

Checks at 97019e91:
- cargo test --locked -p spatial-engine -p spatial-kernel -p spatial-skp: rc=0. 129 "test result" lines summed to 1122 passed, 0 failed, 69 ignored.
- cargo fmt --all -- --check: rc=0.
- npm run typecheck: rc=0.
- npm test: rc=0. 132 files passed, 1699 tests passed.
- verify-cites: rc=0. "verify:cites PASS ... 3811 file(s) ... 240 loose reference(s) advised".
- verify-quotes: rc=0. "PASS 161 checked, 130 verified, 30 baselined, 1 advisory, 0 errors".
- verify-test-claims: rc=0. "PASS 971 claimed test(s) across 300 file(s)".
- verify-mutation --base 2df8b4ae --head HEAD: rc=0. "PASS all 8 new test(s) have a recorded mutation naming them". It records mutations and ran none.
- verify.mjs: rc=0. "verify:plan PASS ... PLAN.yaml agrees with the repository".
- node --test (plan, hooks, evidence): rc=0. 623 tests, 623 pass, 0 fail.
- All logs are in D:/wt/c1rd-logs/ under words30-*. The disk floor was met before each heavy run (C: 41849 MB, D: 28797 MB at the last read).

Self-check, the four classes:
- The change is words only. No cross-module code was written.
- The completion claims point to the logs above.
- The user-facing words are the ruling's own bytes.
- The checks reached their assertions, with exit codes read from the runs.

Departures:
1. For the shell run I took the shared hold in a separate Bash call and not in the one-call shape. I then ran the npm script and the release in one call, and the release was issued. The cargo run used the one-call shape.
2. The first light checks (verify-*, node --test) ran without a hold. That is within "light", but node --test took about 116 s.
3. The first tab and CR grep used grep -P, which failed under this locale. I re-ran it with printf-built patterns: 0 matches.
4. The brief's "read by git show" of the ruling went through git show origin/main:<path> into words30-ruling.md. The form's §7 was read only for its counting command.
5. I ran no mutation and no clippy, and I did not touch the PR.

Model: Sonnet 5.5, no override. No context handoff received or produced.
