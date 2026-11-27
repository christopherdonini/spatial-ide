*Filed by the custodian: the worker's build report, node:partitioned-ordinal-refusal-opens-the-identity-form@build-worker-1, on branch cut/partitioned-ordinal-refusal-opens-the-identity-form (head 1834e19923371b9f146c588711821e6ff88468d9, base da55b7a608369030a88182955840c6b33b9cebcf), dispatched at 2026-11-23T19:42:50Z. Its run: Bash 95, Write 3, Read 1, SubagentHandback 1, by unique call ids, 4 calls errored; model claude-sonnet-5-5, from 2026-11-23T19:42:50Z to 2026-11-23T21:29:02Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 9034 bytes, sha256 27da2092beec8b5fac5b71b90f56c1adf7b5baaeb590d237e0ac6e55a7e66840, byte for byte, 3 values masked by the custodian (a project name, as <m>); 1 path of a file on the branch only, cited with a line, written as the file name alone by the custodian: `kernel/tests/partitioned_refusal_offers_no_declaration.rs` to `partitioned_refusal_offers_no_declaration.rs`, with one final newline added. It is evidence for the closing amendment, not a gate.*

---

REPORT, partitioned-ordinal-refusal-opens-the-identity-form (worker-1; model: Sonnet 5.5, no override, no context handoff)

STATE: head 1834e19923371b9f146c588711821e6ff88468d9, pushed to origin/cut/partitioned-ordinal-refusal-opens-the-identity-form; git status --porcelain is empty. No PR opened.
Commits on da55b7a6..HEAD (four, not three):
- 43a71373 P0 test commit
- 2b90ed511f119052d752c849c7507ba59218cf39 the fix
- 38f7a515 the words and the recorded mutations
- 1834e199 extra: it shortens the kernel test's RECORDED MUTATION comment. verify-mutation reported MISS because the test name sat 519 chars from the word "mutation", over the 500-char window. It reports PASS now.

STEP 1: `git grep -n -F "or declare an identity column"` at the base hit 4 places:
- KNOWN-LIMITATIONS.md:285 (in Scope)
- formatRefusal.ts:123 (in Scope)
- protocol/skp/tests/data/v0-error-identity_ordinal_partitioned_unsupported.json:3 (OPEN-2 (a): left, shape-only test)
- a state/consults report
No test outside Scope pins the text, so I2 did not fire. error.rs:182-191, formatRefusal.ts:61-62 and :119-124, and item 20 matched the form's cites, so I3 did not fire.

P0 (at base, before the fix):
- K1 FAILED at partitioned_refusal_offers_no_declaration.rs:78:9 (assertion (c)), with the panic text "refused: this source is partitioned across more than one file (C:\dev\wt\partref\target/fixtures/partitioned-refusal-remedy/parts is a directory), and session identity is a row's position within one file. Open a single file, or declare an identity column that is carried in the data". Result line: `test result: FAILED. 0 passed; 1 failed`.
- S1 FAILED at formatRefusal.test.ts:182: `AssertionError: expected 'This source is spread across more tha…' not to contain 'or declare an identity column'`. Result: `Tests  1 failed | 14 passed (15)`. S2 was among the 14 passed.
After the fix (commit 2): K1 `ok. 1 passed`; engine lib error `ok. 4 passed`; typed_terminal_codes `ok. 8 passed`; no_generation_in_persisted_artifacts `ok. 9 passed`. Vitest of formatRefusal and fixtures: `Test Files 2 passed (2), Tests 37 passed (37)`. The same four cargo runs on HEAD give the same results.

MUTATIONS (each against 2b90ed51; each restored from a copy in D:/wt-data/partref/orig and checked with cmp against `git show HEAD:<file>`):
- M-S1 (formatRefusal.ts text ends "Open a single file, or declare an identity column."): S1 failed by name, `expected '[P6 placeholder] This app cannot open…' not to contain 'or declare an identity column'` (formatRefusal.test.ts:182).
- M-S2 (AdmissionPanel.tsx formFamilyForCode also returns "identity" for the code): S2 failed by name, `expected 'identity' to be null` (formatRefusal.test.ts:193).
- M-K1 (old last clause appended to D1 in error.rs): K1 failed at (c), kernel test line 78:9, panic text = D1 + ". Open a single file, or decla…".
- cmp: cmp-ts-ok printed for formatRefusal.ts and AdmissionPanel.tsx; cmp-rs-ok printed for error.rs. Each was clean after restore.
- All three mutations were applied together, not one at a time. Each touches a different file, and each test reads only its own file, so each failure is independent. M-S1 and M-S2 ran in one vitest run; M-K1 ran in its own cargo run.
- M-K1b (guard the gate at dataset.rs:327) was not run. It is a `kernel/src`-adjacent engine edit outside the brief's list. The form marks it "recorded", so I left it.
- The mutations are recorded as RECORDED MUTATION comments in commits 3 and 4. They cite the observed commit, no line numbers.

DISK (`df -m /c`, free MB, UTC): 43107 @19:42; 42910 @19:43; 42861 @19:44; 42833 @19:57; 42752 @20:21; 42751 @20:23; 42755 @20:21; 42378 @21:25; 42261 @21:28. All above the 40960 floor.

SUITES:
- `cargo test --locked -p spatial-engine --lib error` rc 0.
- Kernel three tests rc 0.
- vitest formatRefusal + fixtures rc 0.
- `cargo fmt --all --check` rc 0.
- verify.mjs rc 0 (PASS).
- verify-cites rc 0 (PASS).
- verify-quotes rc 0 (PASS, 2 baselined).
- verify-test-claims rc 0 (PASS).
- verify-mutation `--base da55b7a6 --head HEAD` rc 0 (PASS, all 3 new tests named). This is a check only.
- `node --test` scripts/plan, hooks and evidence: 623 pass, 0 fail.
- Shell `npm run test:residency-trace`, `test:citation-integrity`, `test:export-elapsed` and `test:s5d-verdict`: rc 0 each. I ran these four directly, because the verify chain stopped before them.
- **`npm run verify` in frontends/shell: exit 1**, from `npm run test` (1 failed | 1609 passed). The failing test is src/canvas/WorkingCanvas.test.ts "RF10: a new filter generation and the unreported fit clear lastQueriedRef, and the camera is written in exactly three places". The assertion is `expected '' to contain 'lastQueriedRef.current = null;'` at WorkingCanvas.test.ts:856. This piece does not touch WorkingCanvas.tsx or its test (`git diff da55b7a6..HEAD` lists none). The colour-by-refill branch head is still da55b7a6 and holds no new commit in that file, so I read this as a failure already on the base, from colour-by-refill's own test. Everything before the `npm run test` step passed (typecheck, checks, build, dist checks). The log is D:/wt-data/partref/verify.log. This needs a ruling; I did not stop on it.

COUNT (section 7's command on da55b7a608369030a88182955840c6b33b9cebcf...HEAD), added/deleted:
- KNOWN-LIMITATIONS.md 9/7
- engine/src/error.rs 8/3
- formatRefusal.test.ts 26/6
- formatRefusal.ts 11/5
- kernel/tests/partitioned_refusal_offers_no_declaration.rs 93/0
Total 147 + 21 = 168, under the 200 ceiling. The five files are the only files in the diff.

TEXTS COPIED (by script from the form in read-1123ac; the scripts and extracted text files are in D:/wt-data/partref):
- D1 is the F1 New text, copied from the form's Amendment 2 (the extract script reports its form-file line as 352). Check: joining the Rust line continuations in error.rs, it equals "[P6 placeholder] " + D1 (node check true). In KNOWN-LIMITATIONS.md item 20, `grep -c -F` on whitespace-normalised text with `{detail}` -> `<detail>` gives 1.
- D2 comes from the form body (the extract script reports line 122). Check: joining the TS string pieces in formatRefusal.ts, it equals "[P6 placeholder] " + D2 (node check true).
- D3 (extract line 127): `grep -c -F` on normalised item 20 gives 1.
- In KNOWN-LIMITATIONS.md the placeholder mark in the quoted message wraps across a line break after "[P6 placeholder]".

MY DRAFTS (none are the human's or advisor's words):
- the doc paragraph on the variant in error.rs
- the doc bullet at formatRefusal.ts :61-62
- the source comment in the formatRefusal.ts case
- S1 and S2 comments and test bodies
- K1
- item 20's comment tail: "Whose words: ... D1 ... D3, the worker's draft until the advisor words it (OPEN-5)"

DEVIATIONS / NOTES:
- Item 20's comment cites the Display by path and symbol, unpinned, per Amendment 2 F10 and not the brief's "re-pinned". I removed the old `error.rs:383-388 @ 4fd3259a… sha256` pin.
- formatRefusal.ts :67-70 (the placeholder-doc paragraph) is left as is. F9 says it is updated "at the words commit", after the advisor's ruling.
- The source comment in formatRefusal.ts cites the form by path (section 0, Reach) on one contiguous line over 100 columns, per rule (d).
- The brief asked for three commits; I made four, for the reason given above.

CALLER GREP (no new pub item, option or callback): S2 imports formFamilyForCode and nextFormFamily from AdmissionPanel.tsx. Both already exist and were not changed. The change adds only message text, doc and comments, and tests.

PRE-GATE FOUR CLASSES:
- Cross-module code uses the interface the other side actually exposes. K1 uses SkpHost::open_dataset with the real OpenDatasetRequest (protocol/skp/src/v0/commands.rs:21-40, :58-60), built after kernel/tests/single_file_bracket_name_open.rs:64-78. It compares SkpError against the engine's EngineError Display.
- Every completion claim points to evidence that exists and proves it. Evidence: the logs and results above. Gap: `npm run verify` is not green, for the base failure above.
- Every user-facing message describes behaviour implemented at this commit. D1 and D2 describe the refusal as implemented, and I did not rely on any claim that the open dialog cannot offer a folder.
- Every required test reaches its intended assertion. K1 and S1 fail at the assertion the form names, and S2 fails under its mutation at its first assertion.

HOLDS: every heavy step ran in a shared hold. Each hold line read `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (commands started from now on inherit it; release when done)`, and each release line read `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`. Several holds printed `MACHINE_WAITING shared: turn of <m> held by <m>` for up to about 55 minutes. No exit code 96 to 99. No timing-sensitive failures. Rust run on D:/wt-targets/partref, TMP and TEMP on D:/wt-data/partref.

TIMES: all work finished by 21:28Z, well before the 04:30Z limit.
