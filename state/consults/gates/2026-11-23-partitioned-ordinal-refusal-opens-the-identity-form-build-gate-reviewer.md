Reviewed: branch cut/partitioned-ordinal-refusal-opens-the-identity-form at 26cb874525d5bdace5035ce564d1f14bc74657d8, PR 366 (draft), in the branch worktree C:/dev/wt/partref, where it made its mutations by Bash; the records at main 14d2fc717c671134e4029f1459046e49e79595f2 in C:/dev/wt/read-1123aj (the custodian's filing note, 2026-11-24: the reviewer's build gate, node:partitioned-ordinal-refusal-opens-the-identity-form@build-gate-reviewer-1, dispatched at 2026-11-23T23:18:01Z; its run: Bash 75, Read 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T23:18:01Z to 2026-11-24T00:19:44Z by its transcript; 0 calls named the main checkout; handed back at 2026-11-24T00:19:43Z. Filed below the rule from its hand-back, 18956 bytes, sha256 0c87c111a3e9fdc472877bbf1cc2f5abb6183e39e47b5e44c1c6f4969ac4ace1, byte for byte, nothing masked; 1 path of a file not on main, cited with a line, written as the file name alone by the custodian: `kernel/tests/partitioned_refusal_offers_no_declaration.rs` to `partitioned_refusal_offers_no_declaration.rs`, with one final newline added. PASS WITH NOTES: no Correctness or Evidence finding; P0 observed again (K1 and S1 red for their stated reasons, S2 green, as section 5 has it); M-S1, M-S2, M-K1 and M-K1b observed at 26cb8745, each failing only its predicted test, M-K1b observed for the first time; D-1 to D-3 Documentation, the reviewer words, to fix in PR 366 with no re-gate; for the closing amendment the observations at 26cb8745 and the S1 comment outcome text; OPEN-2 (a) noted as ruled; the section 7 count 177 lines over 5 files; the PR checks 20 of 20 pass by its report.)

---

Verdict: PASS WITH NOTES — cut/partitioned-ordinal-refusal-opens-the-identity-form @ 26cb874525d5bdace5035ce564d1f14bc74657d8
Reviewed: C:/dev/wt/partref @ 26cb874525d5bdace5035ce564d1f14bc74657d8
REPORT PATH: state/consults/gates/2026-11-23-partitioned-ordinal-refusal-opens-the-identity-form-build-gate-reviewer.md

Tag: node:partitioned-ordinal-refusal-opens-the-identity-form@build-gate-reviewer-1. The diff I read is `git diff 2095a7ac...26cb8745`. Its sha256 is 8bb39da0c716…, the same as `<S>/partref-diff-26cb8745.txt`, and the merge base is 2095a7ac.

## Correctness
None.

## Evidence
None. P0 was observed again and matches §5. All four mutations were made again and each failed only its predicted test, at its predicted assertion. Every suite returned rc 0. All 20 CI checks pass on the head.

## Documentation (to fix in this PR before the merge; none of these is a FAIL)
None of the three sentences below is the human's wording, and none is a word ADV-2026-11-23-27 rules. The worker applies the words with no re-gate, and the PR body lists them (§31).

**D-1. `engine/src/error.rs`, the first line of the variant's doc.** The form's §0 names this line as untrue: the refusal comes before any identity path. The intake table puts it In (§2.1). The build added a paragraph below it that says the opposite, and left the line itself unchanged, so the doc now contradicts itself.
- Clause check for the new words: "a folder or a pattern" matches the only two arms of `partitioned_source_detail`, `path.is_dir()` and the glob-metacharacter text. That the refusal comes before any identity is read is already said by the added paragraph: the gate in `open_inner` runs before `admit_identity`.
```text
    /// A **partitioned** source reached the session-ordinal path — R-I4 (§2d; boundary 7).
```
```text
    /// A path read as a **partitioned** source, a folder or a pattern — R-I4 (§2d; boundary 7).
```

**D-2. `frontends/shell/src/admission/formatRefusal.ts`, the header paragraph changed at 26cb8745 (the worker's draft).** It has three problems:
- "were the human's at P6" is said of all four strings, but only one moved to the advisor. The paragraph right after it says of `engine.source_changed` "P6 still sights it".
- "The others it names as placeholders" does not say which strings. Two placeholders remain: `publish.geographic_crs_not_publishable` and `engine.internal_inconsistency`. The four strings are the list in the count test, `formatRefusal.test.ts` "the guidance count matches the cases".
- Clause check for the new words: the advisor's wording is ADV-2026-11-23-27 item 7. Only the partitioned case's string changed in the range. The §12d quotation is kept byte for byte.
```text
 * **All four of the strings added here were the human's at P6** (`ADMISSION-PREREGISTRATION.md`
 * §12d's "the four new user-visible states whose strings are sighted at P6"). The guidance for
 * `engine.identity_ordinal_partitioned_unsupported` is now the advisor's wording, under
 * ADV-2026-11-23-27 item 7 and the human's delegation of 2026-11-13. The others it names as
 * placeholders stay placeholders, written so the states exist and can be read end to end;
 * **their wording is not settled** and no test asserts them verbatim.
```
```text
 * **All four of the strings added here were set for the human's sight at P6**
 * (`ADMISSION-PREREGISTRATION.md` §12d's "the four new user-visible states whose strings are
 * sighted at P6"). The guidance for `engine.identity_ordinal_partitioned_unsupported` is now the
 * advisor's wording, under ADV-2026-11-23-27 item 7 and the human's delegation of 2026-11-13; the
 * other three are unchanged. Two of them, `publish.geographic_crs_not_publishable` and
 * `engine.internal_inconsistency`, are placeholders written so the states exist and can be read end
 * to end; **their wording is not settled** and no test asserts them verbatim.
```

**D-3. `frontends/shell/src/admission/formatRefusal.test.ts`, line 139 of the describe header (a Scope file; the line is not in the diff, but this piece makes it untrue).** It says that the three strings other than `source_changed` are placeholders for the P6 sight. The partitioned guidance is now the advisor's wording, and S1 asserts it by properties only.
```text
 * three are placeholders for the P6 sight, and
```
```text
 * three are not asserted verbatim — two are placeholders for the P6 sight, and the partitioned
 * guidance is the advisor's wording (ADV-2026-11-23-27 item 7) — and
```

## Checks

**1. The diff against §2, §7 and §8.** The range touches exactly the five §7 files.
- §2.1:
  - The Display arm is D1.
  - The doc paragraph was added. The first line was not fixed, which is D-1.
  - Nothing else in the engine changed.
- §2.2:
  - The case returns D2.
  - The doc bullet was rewritten.
  - The source comment names the reach gap.
  - `AdmissionPanel.tsx` is untouched.
- §2.3: item 20 holds D3. The comment cites the Display by path and symbol, unpinned (F10), and says whose words it holds (ADV-27 item 5).
- §8, item by item:
  - (1) Pass: no file outside §7.
  - (2) Pass: nothing under `protocol/` or `kernel/src/`.
  - (3) Pass: `AdmissionPanel.tsx`, `RefusalBlock.tsx` and `IdentityDeclarationForm.tsx` are not in the diff.
  - (4) Pass: `dataset.rs` and `skp.rs` are not in the diff, so the code, fields and gate are unchanged.
  - (5) Pass:
    - At 2b90ed51 both D1 and D2 carry `[P6 placeholder] `.
    - 38f7a515 (20:27Z) placed D3's drafted sentence in item 20, with the mark on the quoted message.
    - The words commit 26cb8745 (22:18Z) names ADV-2026-11-23-27. That ruling was filed on main at 06dde5c0, 20:41Z.
  - (6) Pass: no test asserts a placeholder byte for byte. S1 and K1 assert properties, and K1 (e) compares against the engine's own `Display`.
  - (7) Pass: no ADR is edited.
- The seam: K1 drives `SkpHost::open_dataset` with real `OpenDatasetRequest`s and compares `SkpError.message` with `EngineError`'s `Display`. The shell side, `RefusalBlock`, is unchanged.
- Caller grep: no new `pub` item, option or callback. S2 imports `formFamilyForCode` and `nextFormFamily`, which already exist and are used by `AdmissionPanel`.

**2. D1 to D3 against ADV-2026-11-23-27, by script** (`<S>/prr-dcheck.mjs`, output `<S>/prr-dcheck.txt`, rc 0). The ruled lines were read from the filed ruling: line 32 (D1), line 38 (D2) and line 45 (D3). The file has no CR.
- D1: the `IdentityOrdinalPartitionedUnsupported` arm, with Rust's backslash-newline continuations joined, equals the ruled line byte for byte. No `[P6 placeholder]`. No `generation`, ignoring case.
- D2: the case's literals joined equal the ruled line byte for byte. No placeholder mark.
- D3: item 20 quotes D1 exactly once, as `*"…(`<detail>`)…declared"*`, with `{detail}` written as the item writes it now (item 8). The text after the closing mark is `. ` and then the ruled sentence, which occurs once.
- Item 20 with its comment set aside and spacing normalised equals the base item with only the quotation replaced and that one sentence added. "No other word of item 20 changes" holds.
- No placeholder mark is left in item 20.
- F3 read: none of D1, D2, D3 or the rest of item 20 offers a declaration in any wording.

**3. P0, observed again.** The worktree `D:/wt/partref-p0-gate` was made at 43a71373d446af32bbb484f874a4941126d53dd9, `npm ci` ran in `frontends/shell` with rc 0, and the shared cargo target was used.
- K1: rc 101. The build finished with no compile error. K1 FAILED at `partitioned_refusal_offers_no_declaration.rs:78:9`, assertion (c), and the panic is the old message ending "…Open a single file, or declare an identity column that is carried in the data". Output `<S>/prr-p0-k1.txt`.
- `formatRefusal.test.ts`: rc 1, 1 failed and 14 passed out of 15.
  - S1 failed at its second assertion, `formatRefusal.test.ts:182:26` (`not.toContain("or declare an identity column")`): `expected 'This source is spread across more tha…' not to contain 'or declare an identity column'`.
  - S2 ("opens no form") passed.
  - Output `<S>/prr-p0-vitest.txt`.
- This matches §5: K1 and S1 red for their stated reasons, S2 green.
- I then removed the worktree with `git -C C:/dev/wt/partref worktree remove --force D:/wt/partref-p0-gate` (rc 0). It is gone from `worktree list` and from disk.

**4. The mutations, made again at the head.** Each was one anchored `sed -i`, and `git diff` showed exactly one intended line. I restored each file with `git checkout -- <file>`. After each restore `git status --porcelain` was empty, and the file's sha256 equalled its HEAD blob:
- error.rs 4dbc4c78…
- formatRefusal.ts e9e70406…
- AdmissionPanel.tsx 38ae555d…
- dataset.rs bf392807…

The results:
- **M-S1:** `formatRefusal.ts`, the case's last literal ending "Open a single file, or declare an identity column." instead of "Open a single file instead."
  - Run: `npx vitest run src/admission/formatRefusal.test.ts`, rc 1.
  - Only S1 failed (1 failed, 14 passed), at its second assertion, `:186:26`: `expected 'This app cannot open a folder or a pa…' not to contain 'or declare an identity column'`.
  - Output `<S>/prr-m-s1.txt`.
- **M-S2:** `AdmissionPanel.tsx`, `formFamilyForCode` with `if (code === "engine.identity_ordinal_partitioned_unsupported") return "identity";` added after the `identity_unusable` line.
  - Same command, rc 1.
  - Only S2 failed (1 failed, 14 passed), at its first assertion, `:200:37`: `expected 'identity' to be null`.
  - Output `<S>/prr-m-s2.txt`.
- **M-K1, which is also the recorded mutation 1834e199's comment names** (the same edit): `error.rs`, the arm's last literal line `declared"` becomes `declared. Open a single file, or declare an identity column that is carried in the data"`.
  - Run: `cargo test --locked -p spatial-kernel --test partitioned_refusal_offers_no_declaration`, rc 101.
  - K1 FAILED at (c), `:83:9`, and the panic is the mutated message.
  - Output `<S>/prr-m-k1.txt`.
- **M-K1b**, run in addition, because the build report says it was not run: the gate in `dataset.rs` becomes `partitioned_source_detail(path).filter(|_| declared_identity.is_none())`.
  - Same command, rc 101.
  - K1 FAILED at (a) for the declared open, `:75:5`: `left: "engine.source"`, `right: "engine.identity_ordinal_partitioned_unsupported"`, message "source: …\parts is not a readable file". This is exactly §4's prediction.
  - Output `<S>/prr-m-k1b.txt`.

No mutation failed a test outside its predicted set, and none failed no test. I ran only the test each row names.

For the closing amendment:
- It may record these observations at 26cb8745, M-K1b's included. Until now M-K1b had a prediction and no observation.
- The S1 comment's recorded outcome quotes `'[P6 placeholder] This app cannot open…'`. That is true at 2b90ed51, the commit it names. At the head the observed text is `'This app cannot open a folder or a pa…'`.
- `verify-mutation` is a check that a mutation is recorded by name, not an observation of one. My run: rc 0, "all 3 new test(s) have a recorded mutation naming them", output `<S>/prr-verify-mutation.txt`.

**5. Clause checks.**
- **error.rs, the added doc paragraph:**
  - "every open path": all five constructors (lines 223, 237, 258, 279 and 303) call `open_inner`.
  - "before any identity is read, with or without a declared identity column": the gate at :327-329 comes before `admit_identity` at :565, and K1 (d) shows the two errors are equal.
  - Holds. Its first line is D-1.
- **The formatRefusal.ts doc bullet:** holds. The parenthesis gives the reason, not the string's words.
- **The formatRefusal.ts source comment:**
  - "reached only through the dev-only `openPath` hook, or from another client": holds for the shipped build.
    - The bundle targets are `["nsis"]` only, so the shipped build is Windows.
    - The picker returns one `.parquet` file, and a Windows file name cannot hold `*` or `?`.
    - An existing file with a bracket in its name opens.
    - A reopen refuses a data path that is not a regular file (`resolver.rs`).
    - The re-link takes its file from the same file picker.
  - Named, not blocking (§31): on a platform whose file names can hold `*` or `?`, a picked file would reach the refusal. No such build ships.
  - "opens no form for this code": holds. `nextFormFamily` can keep a prior family open, but only if the path turns into a folder between a refusal and the declared resubmit, a file-system change between two requests. S2's comment records that `nextFormFamily` carries a prior family forward.
  - "a single file whose name holds `*` or `?` is also refused": holds, per `partitioned_source_detail`.
- **KNOWN-LIMITATIONS item 20's comment tail:** holds. ADV-27 item 5 has the advisor word the change; item 6 rules D1 and item 8 rules the sentence.
- **K1's doc:** holds, per the runs above.
- **The S1 and S2 comments:** hold.
- **I2:** `git grep -n -F "or declare an identity column"` at the head, rc 0, output `<S>/prr-i2-grep.txt`. The hits are:
  - S1's negative assertion and its recorded-mutation comment;
  - K1's `OLD_OFFER` constant and its comment;
  - the wire fixture `protocol/skp/tests/data/v0-error-identity_ordinal_partitioned_unsupported.json:3`;
  - a 2026-11-07 state/consults report.

  No test asserts the old text as present.
- **I4:** D1's final words hold no `generation`, by script, and `no_generation_in_persisted_artifacts` passes 9 of 9.

**6. The suites at the head.** They ran in one shared hold (`<S>/prr-suites.sh`), with CARGO_TARGET_DIR=D:/wt-targets/partref, TMP and TEMP set to D:/wt-data/partref, and 8 jobs and 8 test threads. Each output file records HEAD 26cb8745 at its start.
- `cargo test --locked -p spatial-engine --lib error`: rc 0, 4 passed. Output `<S>/prr-cargo-engine-error.txt`.
- `cargo test --locked -p spatial-kernel --test partitioned_refusal_offers_no_declaration --test typed_terminal_codes --test no_generation_in_persisted_artifacts`: rc 0, with 1, 8 and 9 passed. Output `<S>/prr-cargo-kernel-three.txt`.
- `cargo test --locked -p spatial-engine --test session_identity`: rc 0, 18 passed. Output `<S>/prr-cargo-engine-session-identity.txt`.
- `cargo fmt --all -- --check`: rc 0. Output `<S>/prr-cargo-fmt.txt`.
- `npm run verify` in `frontends/shell`: rc 0, with vitest 128 files and 1610 tests passed (fixtures.test.ts included), and the four suites after it passing 5/5 and 7/7 among them. RF10 is green after the merge. Output `<S>/prr-shell-verify.txt`.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0, 623 passed and 0 failed. Output `<S>/prr-node-scripts.txt`.
- Outside the hold, light checks:
  - `verify-mutation --base 2095a7ac --head 26cb8745`: rc 0, as in check 4.
  - `verify-cites`: rc 0, PASS over 3734 files. Output `<S>/prr-verify-cites.txt`.
  - `verify-quotes`: rc 0, PASS with 159 checked. Output `<S>/prr-verify-quotes.txt`.
- Every run ended by 2026-11-24T00:17Z, before 04:30Z.

**7. §7, by its own counting command** on `2095a7ac...26cb8745` (rc 0, output `<S>/prr-count.txt`):

| File | Added | Deleted |
|---|---|---|
| `KNOWN-LIMITATIONS.md` | 8 | 7 |
| `engine/src/error.rs` | 8 | 3 |
| `formatRefusal.test.ts` | 26 | 6 |
| `formatRefusal.ts` | 17 | 9 |
| the kernel test | 93 | 0 |

That is 177 lines over 5 files, within 200 lines and 5 files. The unfiltered numstat lists the same five files (`<S>/prr-count-all.txt`). There is no class 8 or class 9 case.

**8. CI.**
- First read at 2026-11-23T23:21:48Z: 20 checks, all pass (`<S>/prr-ci-1.txt`).
- Final read at 2026-11-24T00:17:26Z: 20 checks, all pass (`<S>/prr-ci-2.txt`).
- None is pending. The push run and the pull_request run both have headSha 26cb8745.

## Notes (no finding)
- OPEN-2 (a), as ruled: the wire fixture's message and `protocol/skp/SKP-V0.md`'s code entry still hold the old text, which now differs from the `Display`. The closing amendment records this as the finding for the next piece holding `protocol/` (ADV-27 item 2). The PR body does not mention it.
- The formatRefusal.ts source comment names the form by path and section. The form is on main (14d2fc71) but not on this branch. It resolves once main is merged in before the merge request, as the PR body says will happen.
- Item 20's quotation line is now 175 columns, because a line break went with the placeholder mark. It renders the same.
- Holds: four shared holds (P0, M-K1, M-K1b, the suites). Hold lines read `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (…)` and `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`. Waits printed `MACHINE_WAITING shared: turn of <m>`, up to about 23 minutes for M-K1. There was no MACHINE_ERROR and no exit code from 96 to 99.
- `df -m /c`, free MB: 41443 (23:18Z), 41464, 41442, 41359, 44448, 44419, 44388, 44362 (00:06Z). All are above 40960.
- K1 writes its fixture under the workspace's `target/` on C: (`CARGO_MANIFEST_DIR/../target`), not under CARGO_TARGET_DIR. It is gitignored and small.
- The worktree is clean at 26cb8745. Nothing was committed or pushed, and no stash was used.

## Files read
- C:/dev/wt/read-1123aj/governance/forms/frontends/PARTITIONED-ORDINAL-REFUSAL-OPENS-THE-IDENTITY-FORM-PREREGISTRATION.md
- C:/dev/wt/read-1123aj/state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-20-the-identity-route-open-1-a-the-adr-016-amendment-the-advisors-open-3-to-5-a-the-partitioned-refusal-node-added.md
- C:/dev/wt/read-1123aj/state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-27-the-partitioned-refusal-open-1-to-3-a-the-adr-016-note-in-the-identity-pr-d1-to-d3-worded.md
- C:/dev/wt/read-1123aj/state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-32-records-commits-go-on-from-05z-the-hooks-run-as-always-beside-the-four-checks-the-order-on-app-tsx.md
- C:/dev/wt/read-1123aj/state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-17-milestone-5-open-items-as-recommended-the-cap-if-urgency-1-is-always-kept-pieces-that-share-a-file.md (item 8)
- C:/dev/wt/read-1123aj/state/consults/2026-11-23-partitioned-ordinal-refusal-opens-the-identity-form-worker-report.md
- C:/dev/wt/read-1123aj/state/consults/2026-11-23-partitioned-ordinal-refusal-opens-the-identity-form-words-worker-report.md
- `<S>/partref-diff-26cb8745.txt`; the PR 366 body (`<S>/prr-prbody.txt`)
- At C:/dev/wt/partref:
  - engine/src/error.rs
  - engine/src/dataset.rs (`open_inner`, `partitioned_source_detail`)
  - frontends/shell/src/admission/formatRefusal.ts
  - frontends/shell/src/admission/formatRefusal.test.ts
  - frontends/shell/src/admission/AdmissionPanel.tsx (25-60, 395-460)
  - kernel/tests/partitioned_refusal_offers_no_declaration.rs
  - KNOWN-LIMITATIONS.md item 20
  - frontends/shell/src-tauri/tauri.conf.json (bundle targets)
  - scripts/plan/verify-mutation.mjs and scripts/plan/verify-quotes.mjs (headers)

Model: Claude Opus 5.5 (claude-opus-5-5).
