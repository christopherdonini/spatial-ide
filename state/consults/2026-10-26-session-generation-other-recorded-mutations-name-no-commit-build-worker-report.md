*Custodian's filing note (2026-10-26): the worker-high's build of `session-generation-other-recorded-mutations-name-no-commit` (the filler queue's entry 5c) on its branch, from main 2a6adbb1, head ce318b5e; draft PR #261. The custodian's check: the numstat from 2a6adbb1 is 49 and 17 in kernel/tests/session_generation.rs alone; origin's branch equals the head. Its writes by the write tools were three scratch scripts; its git verbs one commit and one push; no rebase, reset, PR action or force push (the one force-shaped flag is tar's --force-local); every cargo run inside one of eleven shared holds, none exclusive. Its disclosures 1 to 3, read against the transcript: a tar file first written beside the export folder and deleted at once; a revert and a run issued in one message, the file shown equal to the base; and its read of the machine log, a grep filtered to this project's lines, whose results the custodian checked hold no other project's line. It also listed the machine script's folder once. Its two sign-offs are the ones `-s` adds. The run 04:27:28Z to 05:07:21Z by its transcript (Read 3, Bash 52, Write 3). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 7329c72974279a371008e9ed29dcacc2d71ad537667db69c81429db0281c8766.*

---

Built: session-generation-other-recorded-mutations-name-no-commit at ce318b5ef99124f42dae00c4c41aa163e4dcf8aa

All five observations matched the form's predictions, so no stop rule was met. Worktree is C:/dev/wt/sgo, branch cut/session-generation-other-recorded-mutations-name-no-commit. Base is 2a6adbb10d2ab8bc65e3a3ab8fb9ae057683afcf, substituted for `<base>` and for nothing else. The form's sha256 matched faef1370b9348425c910b2ea989be0ec211cb3e0d63ededd41b57d263bcf3600.

**Pre-run check (base): every named line is where the words describe it.**
- skp.rs:624 is the prune call in attribute_ticket, and :628-631 hold the live-generation check.
- skp.rs:798 is invalidate's filter `d == dataset && *tg == g`, :809-812 its dead-ticket loop, :816 its prune.
- skp.rs:438 is `inner: Mutex<GenerationState>`. All 10 `self.inner.lock()` sites are the registry's, at 575, 603, 623, 659, 679, 713, 756, 768, 788 and 828.
- lib.rs:389 is `impl SourceFactory for EngineSourceFactory`.
- skp.rs, lib.rs and the test file have the same git blob ids at 564a98b2, 2a6adbb1 and HEAD. The form's line numbers therefore hold at the base.

**Observations**
- **Export:** `git archive 2a6adbb1` piped into `tar --force-local -x -C D:/wt-targets/sgo-export`. The three files were sha256-equal to `git show 2a6adbb1:<path>` and were touched before the first run.
- **Cold build:** the first run printed `Compiling spatial-kernel v0.0.0 (D:\wt-targets\sgo-export\kernel)`, and the build took 15m 25s.
- **Unmutated:** every one of the five tests ran `1 passed` before its mutation. The run for M-A was the first, on the cold build.
- **M-A:** FAILED at kernel\tests\session_generation.rs:136:5 with the message `an ended session attributes nothing`. This is the assertion of the second half, as predicted.
- **M-B:** `1 passed`. It built with two warnings, unused `tg` at skp.rs:798 and unused `g` at skp.rs:789.
- **M-C:** `1 passed`.
- **M-D1:** build failed with 3 E0277 errors, each reading "`RefCell<GenerationState>` cannot be shared between threads safely".
  - kernel\src\lib.rs:389:24, `impl SourceFactory for EngineSourceFactory`, required by the bound `SourceFactory: Send + Sync + 'static` at protocol\data-plane\src\transport.rs:154.
  - kernel\src\lib.rs:679:22, `impl BatchSource for EngineSource`.
  - kernel\src\skp.rs:1132:13, the `Arc::new(move |signal: WatchSignal|` closure.
  - The first is the SourceFactory site the form predicts, so the second and third fall under W-D's "among any other sites". The mutated file was applied to the 10 registry sites only. The two `generations.inner.lock()` sites at skp.rs:4373 and :4529 sit in the unit-test module, which the integration-test build does not compile.
- **M-E:** FAILED at kernel\tests\session_generation.rs:563:5 with `assertion left == right failed: and the record kept the handle`, `left: 0`, `right: 1`. This is the predicted assertion.
- **M-D2** was never applied.
- **Restore:** after each revert, skp.rs was `cmp`-equal to `git show 2a6adbb1:kernel/src/skp.rs`, sha256 616586afac7eb1ed67129ccc1a431281e975ca704a400dd260fa9f977c1af14e. After M-E, lib.rs (f6d57439e5b48cf20816385a7c9ce315ca3ec1fa4f127ca6b98fd58d7054ba19) and the test file (7a5c3318a61fc9d9a01f5465f55cd7148597e719ac229ccb27c9fc45ad26ebbb) were byte-equal as well.
- **Method:** I applied the mutations with an exact-string script, each edit required to match once. The diffs against the base were shown before each run. Run outputs were kept in my scratch folder as sgo-w-m*-unmut.txt and sgo-w-m*-mut.txt.

**The words**
- W-A to W-F were copied from the form's fences by my own script, sgo-w-apply.mjs, with `<base>` replaced. Replaced line ranges: W-A :121-122, W-B :145-147, W-C :229-230, W-D :255-257, W-E :544-547, W-F :251-253.
- By script, each new span occurs once and each old span nowhere. Lines over 100 columns: 0, so no rewrap was needed.
- **Commit:** ce318b5ef99124f42dae00c4c41aa163e4dcf8aa, signed off with `-s`. Subject: `docs: session-generation-other-recorded-mutations-name-no-commit, the Change line's five recorded-mutation comments re-observed at their base`.
- **Message file:** the only `@` in it was on the first trailer line, as shown by grep before the commit. It ends with the two trailers you gave.
- **Push:** `2a6adbb1..ce318b5e`, exit 0, in its own call.

**Checks at the head**
| Check | Exit code | Last line |
|---|---|---|
| `cargo test -p spatial-kernel --locked --test session_generation` (shared hold, target D:/wt-targets/sgo, cold build 15m 41s) | 0 | `test result: ok. 12 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.04s` |
| `cargo fmt --all -- --check` (run before the commit and again at head) | 0 both times | no output |
| Doc-lines-only script on `git diff -U0` | 0 | changed lines: 66, non-doc: 0, files: 1 |
| `node scripts/plan/verify.mjs --offline` | 0 | `verify:plan PASS` |
| `verify-cites.mjs` | 0 | `verify:cites PASS`, 2429 files, 101 loose references advised |
| `verify-quotes.mjs` | 0 | `verify:quotes PASS`, 131 checked, 100 verified, 30 baselined |
| `verify-test-claims.mjs` | 0 | `verify:test-claims PASS`, 671 claimed tests |

- `verify-quotes.mjs --show-cites kernel/tests/session_generation.rs` also exited 0.
- **Scope count:** `git diff --numstat 2a6adbb1...HEAD -- kernel/tests/session_generation.rs` gives `49 17`, which is 66 lines against the budget of 90. The branch diff names only that file.

**Final state**
- HEAD equals origin's branch (`ce318b5ef99124f42dae00c4c41aa163e4dcf8aa`; `git ls-remote` agrees), and the porcelain is empty.
- `D:/wt-targets/sgo-export` is removed (`ls` reports it missing). Both targets, `D:/wt-targets/sgo` and `D:/wt-targets/sgo-export-target`, remain.
- No process I started still runs: a process query for leftover cargo, rustc or node on those paths returned nothing.

**Disclosures**
1. My first `git archive` wrote a tar file, `D:/wt-targets/sgo-export.tar`, outside the allowed write locations. I deleted it at once (rc 0, then absent from the listing) and extracted by pipe.
2. I once issued the M-D1 revert and the M-E unmutated run in the same message. The run's output shows it compiled and passed on the restored file, and the sha256 matched the base.
3. For the machine rules I read my own project's lines of the machine log with a filter. I quoted none of any other project's.
4. M-B's mutation, as I worded it, left `tg` in the closure pattern, which adds an unused-variable warning to the `g` one the form names. It is warnings only, and the build passed.
5. No word was changed to fit an outcome.

**Hold lines (my own project's only; 11 holds, all shared, none refused or delayed)**
- Export cold build plus M-A unmutated: 04:28:49Z to 04:44:16Z, 15.5 min, declared 60.
- Export runs, one hold each, 0.0 to 0.4 min, declared 15 (the lines are in the same order):
  - M-A mutated.
  - M-B unmutated.
  - M-B mutated.
  - M-C unmutated.
  - M-C mutated.
  - M-D1 unmutated.
  - M-D1 mutated.
  - M-E unmutated.
  - M-E mutated.
- Worktree suite at head: 04:50:39Z to 05:06:22Z, 15.7 min, declared 60.
- Each line reads `mode=shared ... overdue=no` and carries the `-What` text beginning "session-generation-other-recorded-mutations-name-no-commit:".

Model as the harness reports it: Sonnet 5.5, ID claude-sonnet-5-5.
