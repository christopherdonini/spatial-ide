Reviewed: governance/forms/frontends/TEXT-ID-REOPEN-WITH-A-RECORDED-DECLARATION-PREREGISTRATION.md at main @ 5e9b2184b7fb235fb488afe538ad451f331fdf30, against the code run in the worktree D:/wt/c1rd at 97019e9198a9a2d110d0d686ce8166574547d4ce (PR 369, draft). The C1 piece's build gate, the reviewer (Opus), THE READ PART, with no verdict; its run, from its completion notice only (ADV-2026-11-26-02), was 111 tool uses. Filed by the custodian, 2026-11-27: the hand-back saved by Write with the harness's indent removed (17610 bytes, sha256 2c658cd0e6e5804b4bfce1f49a2678f0398e8ca4bf00ceadf523d3bb28b327a9), byte for byte below the rule.

---

READ PART — cut/text-id-reopen-with-a-recorded-declaration @ 97019e9198a9a2d110d0d686ce8166574547d4ce. I read the form, the rulings and the reports at main 5e9b2184b7fb235fb488afe538ad451f331fdf30 (D:/wt/read-1127c). No verdict is given here.

Everything below is paraphrase unless it is marked verbatim. Every log and script is in D:/wt/c1rd-logs/ under the prefix rr-. The tree was clean after each run: `git -C D:/wt/c1rd status --porcelain` printed nothing. Disk before each heavy run: C: about 41830 MB, D: about 28720 MB.

**The main finding, before the checks:** E-R1's step `TEXTID-C1` cannot pass as written. Its control at step (3) reopens a project the same window still holds, and the kernel refuses that as `skp.project_open_elsewhere`. The step therefore stops at (3) and never reaches step (5), where the seam is checked. Details are under C-1.

## 1. Scope (ADV-2026-11-27-30 item 1)

**Command:** `git diff --name-only 2df8b4ae..HEAD`, compared by `comm` against §7's scope resolved at the base (`rr-scope-all.txt`, 44 files). Changed files not in scope: none. Scope files not changed: five.
- `App.reopen.test.tsx`.
- `admitDataset.ts`, `describeSummaryText.ts` and `client.ts`: their `skp/0.16` stands only in doc comments.
- `responses-accept.json`: an `engine.identity_unusable` document of the `skp/0.2` shape, with no `skp` member.

**How each "each" line was resolved at 2df8b4ae:**
- **engine:** `git grep -n -A6 IdentityUnusable <base> -- 'engine/tests/*.rs'`, then an awk pass for blocks without `..`. Only `engine/tests/identity.rs:119` matched.
- **kernel:** the same grep on `kernel/tests/*.rs` found no file.
- **protocol:** `git grep -l -e skp/0.16 -e engine.identity_unusable <base> -- tests/data/*.json tests/conformance/fixtures/*.json` found 17 files.
- **shell:** `git grep -l skp/0.16 <base> -- 'frontends/shell/src/**'` found 9 files.

**Every changed file is inside §7's scope.** Every change is inside §2 and §4 as gated, read with the amendments:
- `v0-error-identity_unusable-declared.json` carries `mapped:id`, and S-R2 asserts `mapped:id`. That is V1's New, read in place by Amendment 3; it is not §2 item 6's original `mapped:parcel_key`.
- K-R1 closes P1 before replacing its data, as V3 requires.
- The e2e copy is written in the writer's layout (E1, V2). The step's own save is Amendment 5 item 5's class 2.

Changes I name, none outside the gated scope:
- the renamed `skp_version_is_skp_0_17` (Amendment 4 item 6);
- SKP-V0 §4 item 3, §10.1, §11.1 and §12.1 brought to `skp/0.17` as the literal bump's mechanics, as the `skp/0.16` entry did;
- the step's `cpSync` import and its `ENGINE_REFUSAL_NOTICE` copy.

Nothing goes to the advisor under item 1.

## 2. §7's count

**Command:** §7's own counting command at 97019e91 (`rr-numstat.txt`). Result: 791 insertions and 128 deletions, so **919 lines over 39 files**, against 900 lines and 50 files. This equals Amendment 6 item 3.

Per row, by an awk mapping of Amendment 6's file lists:

| Row | Lines | Files |
|---|---|---|
| engine product | 40 | 3 |
| kernel product | 4 | 1 |
| SKP-V0 and `mod.rs` | 30 | 2 |
| the literal and its fixtures | 211 | 23 |
| shell product | 4 | 1 |
| tests: engine | 143 | 2 |
| tests: kernel | 249 | 1 |
| tests: protocol | 85 | 1 |
| tests: shell | 32 | 2 |
| e2e step | 105 | 1 |
| words | 16 | 2 |

Every row equals Amendment 6's table. The reason sentence checks: the three Rust test rows count 477 against ~310, and the four product rows count 78 against ~83.

The literal-only claim also checks: in the 30 changed lines of `types.ts` and the four shell test files, each removed line with `skp/0.16` made `skp/0.17` equals its added line (`cmp` exit 0).

Paths outside the count: the form, `governance/PLAN.yaml`, `CUSTODIAN-QUEUE.*`, `site/**` and `state/**`. None of them is in the diff.

## 3. The mutations, observed again at 97019e91

I read the driver whole: `mutations.mjs`, 5536 bytes, sha256 9b47068332d58551b6975aac3ce076f16ccd3bc5093f8fbf6c66358ce399f09b, matching the locator. Each entry is §4's mutation as amended, and each matches the Mutation line in its test's source:
- **M-RD1:** passes `&IdSource::File` to `admit_column_type`.
- **M-RD2:** the duplicate arm, which ends "returns a wrong-but-plausible …", is valued `IdSource::File.as_envelope_value()`.
- **M-RD3:** writes `"file:id"`.
- **M-RD4:** deletes the pair line.
- **M-RD6:** sets the literal to `skp/0.16`.
- **M-RD5:** deletes the check line.
- **M-RD7:** reads the key `source`.

Each Old text occurs exactly once at the head, by `node rr-oldcheck.mjs` (`occurrences=1` for all seven, no CRLF).

Each mutation ran in its own shared hold: `bash rr-mut.sh <id>`, that is the driver with prefix `rr-<id>`, which reverts with `git checkout -- <file>`. Every failure is at the test's own assertion; none is a compile or import error.

| Mutation | Its test fails at |
|---|---|
| M-RD1 | `identity_refusal_names_its_source.rs:82`, left `"file:id"`, right `"mapped:id"` (exit 101) |
| M-RD2 | `:127`, left `("id", "file:id")`, right `("id", "mapped:id")` |
| M-RD3 | `text_id_reopen_recorded_declaration.rs:180`, left `Some("file:id")`, right `Some("mapped:id")`; K-R2 also fails at `:244` |
| M-RD4 | `:229`, left `None`, right `Some("file:id")`; K-R1 also fails at `:180`. An unused-variable warning only. |
| M-RD6 | W-R1 at `fixtures.rs:1066` (`skp/0.17` against `skp/0.16`) and `skp_version_is_skp_0_17` at `:1024`; five other fixture tests also fail |
| M-RD5 | AssertionError at the `mapped:id` case, expected `{…}` to be null (1 failed, 47 passed) |
| M-RD7 | AssertionError at the `file:id` case, expected null not to be null (1 failed, 24 passed) |

M-RD8 is not run here: it is E-R1's, at the port.

## 4. Suites at the head that start no app, each in a shared hold

- `cargo test --locked -p spatial-engine -p spatial-kernel -p spatial-skp`: rc 0. 129 result lines: 1122 passed, 0 failed, 69 ignored. The five new Rust tests and `skp_version_is_skp_0_17` show ok.
- `cargo fmt --all -- --check`: rc 0, empty output.
- `npm run typecheck`: rc 0. `npm test`: rc 0, 132 files and 1699 tests passed.
- `verify-cites`: rc 0, PASS over 3811 files, 240 loose references advised.
- `verify-quotes`: rc 0, PASS: 161 checked, 130 verified, 30 baselined.
- `verify-plan` (`verify.mjs`): rc 0, PASS.
- `verify-test-claims`: rc 0, PASS, 971 claimed tests.
- `verify-mutation --base 2df8b4ae… --head HEAD`: rc 0, PASS, 8 new tests. This only checks that the mutations are recorded; it observes none.
- CI's `node --test` (scripts/plan, scripts/hooks, scripts/evidence): rc 0, 623 tests, 623 pass, 0 fail.
- Branch CI, by `gh run list --branch …`: every workflow at 97019e91 is completed success. That covers Ported notices, DCO sign-off, Rust fmt, Exposure scan, Product CI (Rust workspace), Governance CI and Product CI (shell).
- No clippy was run.

## 5. Clause checks

**ADV-2026-11-27-30's three fences.** Command: `node rr-fences.mjs`, which reads the ruling from the read checkout. Results:
- Each fence occurs once: row AH8, its result-log line and the README section are 1, 1 and 1.
- Row AH8 is the line directly after `| AH7 `, and the result-log line directly after `- **AH7 (for each`.
- The README ends with a blank line, then the section, then one LF. Its bytes at 1a4b5bbe are an exact prefix of the new file (`cmp -n`).
- Neither file holds a CR, and no fence holds a tab.

**The form's ruled News that land in files.** Command: `node rr-ruled-news.mjs`.
- D-R1's New (ADV-2026-11-27-24 item 4) stands once in `engine/src/error.rs`; its Old stands 0 times.
- D-R2 (i) stands once: its Old line, then its New line, in `AdmissionPanel.tsx`.
- D-R2 (ii)'s New stands once; its Old stands 0 times.
- The other ruled pairs (E1, D1 to D6, V1 to V3, W1 to W4) are form text, read in place by Amendments 2 and 3. Their code consequences are: V1, the declared fixture; V3, K-R1's close; E1 and V2, the e2e layout and fail-by-name. Each is present at the head.

## 6. ADV-2026-11-27-30's places, against the code at the head

**README step (4): does another open replace the project the window holds? Yes, by the code.**
- A direct admission sets `admittedDatasetRef`, so `heldProject` reads null (`App.tsx:1197`, `:1274-1277`).
- The close effect closes the old handle (`App.tsx:1689-1694`, `void closeDataset(resource)`).
- The kernel's `release_ended` then drops that saved entry and its lock (`kernel/src/project/mod.rs:261-268`), at step (5)'s `open_project` (`:783`).
- A timing case, named and not blocking: the close is not awaited. If it has not settled when step (5) calls, the reply is `skp.project_open_elsewhere`, and the step fails by name. This is a harness-timing case for the source comment.

**The other README clauses, against `stepTextidC1` and `main()`:**
- The step's order is true: after `TEXTID'`, before `DUPKEY'` (`admission-remediation.mjs:1145-1148`).
- Opens and the save go through the hooks, choices are clicks, and fields and the owner line are read from the DOM: true.
- Step (1): true.
- Step (2): true. The writer's layout is at `renderer/src/canonical.rs:184-221`: two-space indent and `": "`. The byte check is at `strict_json.rs:103-110`.
- The two refusals of step (4) are as the code gives them: the lock at `mod.rs:784-790`, and `asks` for a first folder that still holds the project at `:744-746`. True.
- Step (5): true.
- The exit codes 0 and 1 (`:1168`, `:1197`): true. Not in CI and not in `npm run verify`: true (`package.json:17`, `:28`; no workflow names the suite).
- "What it proves not": true.
- **Step (3), the control: untrue by the code.** The step expects the reopen of the first folder to be refused as `engine.identity_unusable` with the choice offered. The kernel instead refuses it as `skp.project_open_elsewhere`; see C-1. This is ruled text, so it goes to the advisor unreworded.

**Row AH8: true by the code.** Its expected outcome still rests on E-R1's step (5), which has not run.
- **The writer's layout:** a member's value object goes on three lines, the inner member two spaces deeper, with a comma after `}` only when another member follows (`canonical.rs:197-215`).
- **The reader's refusal:** other bytes are refused through `check_spelling` → `OpenFailure::FileRefused` → `SkpError::project_file_refused(path, rule)`, code `skp.project_file_refused` with the fields `path` and `rule` (`file.rs:153-158`, `:138-140`; `mod.rs:976-978`; `protocol/skp/src/v0/error.rs:208-213`).
- **The owner line:** R-ENG, because an `engine.*` refusal with no choice keeps R-ENG (`openProject.ts:85`, `:96`). Its string equals AH8's quoted line (`reopenNotices.ts:106`).
- **No button:** `rowPositionOffer` returns null for `mapped:id` (`AdmissionPanel.tsx:229`). `relinkOffer` shows only beside the locator's line (`:163-169`).
- **No form:** a reopen's refusal sets `formFamily` to null (`:390`).
- **Nothing written:** "Close the app" frees the lock, and AH5's folder is known, so the place is `Place::Known`. Only `Place::Copy` writes `project.spatial` (`mod.rs:743`, `:797-799`). A refused reopen writes nothing to it.

## 7. Amendment 5 item 5

**Bytes:** the step's line replacement writes exactly what the writer spells for `identity {"column":"id"}`: same indent, two spaces deeper, `}` with the original comma, LF kept. The reader accepts it. K-R1 shows that a real save records `{"column": "id"}` (`text_id_reopen_recorded_declaration.rs:167-171`), and `write_project` reads back its own output (`file.rs:144-150`).

**The seam:** the copy would reach the seam E-R1 serves. `open_project` sends `admission.identity` (`mod.rs:821-827`), the engine values it `mapped:id`, and `error_of` passes it through. **But as written the step never gets there:** it stops at step (3) (C-1).

## 8. §9, Block on sight (with Amendment 1's item 5)

1. Code before the form: untrue. ADV-2026-11-27-24 was filed at e830cdc1 (13:49+01). The form was committed at 90d7286f (14:25+01). Code began at 2f44cb9e (17:04+01).
2. A path outside §7: untrue (check 1).
3. The offer beside a refusal not `file:id`, or with the field absent: untrue. The check is fail-closed (`AdmissionPanel.tsx:229`), and the only place the offer is rendered goes through it (`:605`, `:726-731`).
4. A changed engine message, R-ENG, S-8 or S-1 to S-6c: untrue. Only `Display`'s destructure changes (`error.rs:388`). `reopenNotices.ts`, `RowPositionChoice.tsx` and `describeSummaryText.ts` are unchanged.
5. The field valued other than by `as_envelope_value` in engine/src, or composed in the kernel: untrue. The only value sites are `dataset.rs:2081`, `:2103`, `:2165`, `:2178` and `identity.rs:391`. The kernel passes it through (`skp.rs:2252`, `:2264`). No other crate names `IdentityUnusable`.
6. A request member or `protocol/data-plane/` changed: untrue. `mod.rs` changes only the literal and its doc, and `git diff --stat` of the data plane is empty.
7. A byte of what a project records: untrue. `dataset_ref.rs`, `kernel/src/project/**` and `renderer/**` are untouched.
8. An edit to ADR-016: untrue. `docs/` is untouched.
9. A claim that a test was written before its code: untrue. A grep of the PR body and the commit messages found none.

## 9. §10's seams and guarantees, by the tests it names

- **Engine to kernel:** K-R1 and K-R2 are present and green; red under M-RD3 and M-RD4.
- **Kernel to wire (W3's New):** K-R1, K-R2, W-R1 and S-R2 are present and green; red under M-RD3, M-RD4, M-RD6 and M-RD7.
- **Wire to shell:** S-R2 is green and red under M-RD7. E-R1 has not run and, as written, cannot pass (C-1).
- **Kernel project to engine:** K-R1 (i) is green and red under M-RD3.
- **Guarantees:**
  - Decision 1's shell half rests on S-R1 (red under M-RD5); its real-app proof is E-R1, which is blocked by C-1.
  - Decision 2 rests on K-R1 (i)'s `identity_set_aside_refused`.
  - Decision 6 rests on K-R1 (ii)'s `file:id` with S-R1's control.

## 10. The workers' departures

None touches a result.
- **The build's early engine edits:** the base run's log names no `identity_source`, and it passed 1117. Engine edits compiled without the kernel's arm would not have compiled.
- **The hold in parentheses, and TMP on D:**: procedural only.
- **The rename:** observed again here under M-RD6.
- **The words worker's departures** (a separate hold call, light checks outside a hold, a `grep -P` re-run, reading the ruling from origin/main): procedural only. I checked the words independently in check 5.

## Findings

**C-1 (Correctness; the correction changes code). E-R1's step `TEXTID-C1` stops at its control, step (3).**
- Step (1)'s save is a first save, so it takes the identity's open lock for the open that is still on the map (`mod.rs:397-418`).
- Step (3) reopens the same folder in the same window. `release_ended` keeps a live open (`:261-268`), so `try_lock` answers Held and the reply is `skp.project_open_elsewhere` (`:784-790`).
- The kernel's own test asserts exactly this as its control: K-O26, `kernel/tests/project_reopen.rs:1880-1907`. Its doc line says, verbatim: "A saved open holds its identity's lock, so a reopen of its folder by the same `Projects` is refused as open elsewhere (the control)."
- `e2e/reopen.mjs` `stepR3`→`stepR4` expects the same answer through the app.
- So step (3) throws "the control's reopen answered…", and step (5), the only real-app proof of the wire-to-shell seam, is never reached.
- The fix needs the window's open to end between (1)'s save and (3)'s reopen; the worker or the advisor shapes it.
- **Outside this piece:** text-id's own `TEXTID'` (d) at the base does the same thing (save, then reopen in one window, `stepTextid` (d)). This step's docblock says it works "as TEXTID' (d) does". It needs routing to text-id's run part.

**C-2 (Correctness; ruled text, so no words proposed). The README section's step (3) clause is untrue at the code.** It says the first folder's reopen is refused as `engine.identity_unusable` with `identity_source` `file:id` and the choice offered; the code refuses it as `skp.project_open_elsewhere`, by C-1. It goes to the advisor unreworded. If C-1's correction changes the step, the section's (3) and (4) may need the advisor's words again. Whether that needs code: only through C-1.

**E-1 (Evidence; low; the correction changes test data only, not product code). S-R2's positive control rides on a fixture the engine at the head cannot produce.**
- `v0-error-identity_unusable-with-candidates.json` keeps the `skp/0.2` detail ("the file has no such column, and no identity mapping was declared") and now carries `identity_source` `file:id`.
- At the head, a file with no `id` column opens on the session tier (`dataset.rs:2062-2089`), and "no such column" is raised only for a declared column, so it would be valued `mapped:` (`:2076-2083`).
- The `file:id` value is still proven from the real engine by K-R2 (`text_id_reopen_recorded_declaration.rs:224-233`), so the seam is not unproven. But S-R2's "real fixture" description overstates this one file.
- For the advisor or the custodian to decide; I propose no words.

**Named for a source comment, not blocking:** the close in step (4) is not awaited (`App.tsx:1691`), so step (5) can meet `skp.project_open_elsewhere` while that close is in flight. It is a harness-timing case and fails by name.

**Documentation:** none.

Files of note:
- D:/wt/c1rd/frontends/shell/e2e/admission-remediation.mjs
- D:/wt/c1rd/kernel/src/project/mod.rs
- D:/wt/c1rd/kernel/tests/project_reopen.rs
- D:/wt/c1rd/frontends/shell/e2e/README.md
- D:/wt/c1rd-logs/ (the rr-* logs and scripts)
