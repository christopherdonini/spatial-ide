*Filed by the custodian: the worker's report of the partitioned refusal's words commit (ADV-2026-11-23-27, D1 to D3 in fences 2, 3 and 4), node:partitioned-ordinal-refusal-opens-the-identity-form@words, on cut/partitioned-ordinal-refusal-opens-the-identity-form: the merge 4c028ef688c012f10ac572c7c75bd170ad59fdf8 of colour-by-refill's head 2095a7ac, then the words commit 26cb874525d5bdace5035ce564d1f14bc74657d8, dispatched at 2026-11-23T22:06:05Z. Its run: Bash 35, Write 2, Read 1, SubagentHandback 1, by unique call ids, 2 calls errored; model claude-sonnet-5-5, from 2026-11-23T22:06:08Z to 2026-11-23T22:19:06Z by its transcript; 4 calls named the main checkout (Bash calls reading committed files there by git show at f0718827, as its brief directs, which change nothing). The report below from its hand-back, 7510 bytes, sha256 dbeb4b9119ad73dfe78ebbf2f541ed641fd80e49db38b9a6dbb6ae53706d38a3, byte for byte, 3 values of the machine script's lines masked by the custodian, as <m>, with one final newline added. Its step 4 header paragraph and its item 20 comment tail are the worker's drafts, as it says. It is evidence for the build gates, not a gate.*

---

DONE. Merge and words commit pushed. All runs and checks green. No stop was hit.

**Heads.** Before: 1834e19923371b9f146c588711821e6ff88468d9 (clean). After the merge: 4c028ef688c012f10ac572c7c75bd170ad59fdf8. After the words commit: 26cb874525d5bdace5035ce564d1f14bc74657d8.
- Merge: `git fetch` gave FETCH_HEAD 2095a7ac471d2441fd8e054a448d334c7bcde455. `--no-ff --signoff`, no conflict. It changed only `frontends/shell/src/canvas/WorkingCanvas.test.ts`.
- Words commit: `git commit -s -F`, the subject as the brief gives it. The Signed-off-by line was added by `-s` from git config; I typed none.
- Push: `1834e199..26cb8745  cut/partitioned-ordinal-refusal-opens-the-identity-form -> cut/partitioned-ordinal-refusal-opens-the-identity-form`.

**Fences.** THE RULING has 8 four-backtick lines, at lines 19, 25, 31, 33, 37, 39, 44, 46. I took the second, third and fourth pairs (31-33, 37-39, 44-46), by node script from the `git show f0718827` bytes. Each is one line.
- FENCE 1 (D1), sha256 8e5f2b0fa28ba13f576f06c89e3afbee7446f3146d9bd77cd901f31cbc76d2e8: `refused: this path is read as a folder or a pattern, not as one file ({detail}). This engine opens a single file only, and it refuses such a path before reading it, whether or not an identity column is declared`
- FENCE 2 (D2), sha256 c64236700c9896f93a21b61c1828de2aca9f25eb35e6b7f28ea1ba55e6a9f122: `This app cannot open a folder or a pattern of files, and declaring an identity column does not change that. Open a single file instead.`
- FENCE 3 (D3 sentence), sha256 929bc2222a29ee0076918cde598614f031d097b889157d3d7f78048d5b2d7e3a: `Declaring an identity column does not change this: the refusal comes before any identity is read.`

**Checks, by node script, all true.**
- Step 2: the arm's string with its Rust line continuations joined equals FENCE 1.
- Step 3: the case's string pieces joined equal FENCE 2.
- Step 5: the quoted message of item 20, whitespace normalised and with `{detail}` for `` `<detail>` ``, equals FENCE 1. The text after the closing quotation mark begins `. ` + FENCE 3, then `The same code and message are…`.

**Edits** (step 4 and the item-20 comment tail are my drafts, not advisor text):
- D1, `engine/src/error.rs` line 392: removed `[P6 placeholder] ` from the `IdentityOrdinalPartitionedUnsupported` arm only. The coverage-lost arm at 427-432 is untouched.
- D2, `formatRefusal.ts`: removed `[P6 placeholder] ` from the `engine.identity_ordinal_partitioned_unsupported` case only.
- Step 4 (draft): the header paragraph (lines 68-71 before, 68-73 after) changed from `All four … are the human's at P6 … Three are placeholders written so the states exist …` to `All four … were the human's at P6 … The guidance for \`engine.identity_ordinal_partitioned_unsupported\` is now the advisor's wording, under ADV-2026-11-23-27 item 7 and the human's delegation of 2026-11-13. The others it names as placeholders stay placeholders, written so the states exist and can be read end to end; **their wording is not settled** and no test asserts them verbatim.` The §12d quotation is unchanged.
- D3, `KNOWN-LIMITATIONS.md` item 20: the quotation now opens `*"refused: this path is read as a folder or a pattern, not as one file (\`<detail>\`). This engine` (mark, line break and indent removed). FENCE 3 was already the following sentence: the item already read `Declaring an identity column does not change this: the refusal comes before any identity is read.` Its text equals FENCE 3 byte for byte, so I added nothing.
- Item 20 comment tail (draft): `Whose words: the advisor's, under the human's delegation of 2026-11-13 (ADV-2026-11-23-27 item 5): item 6 for the quoted message and item 8 for the sentence after it -->` It replaces the old tail that named the worker's draft and OPEN-5.
- Step 6: `grep -F 'P6 placeholder'` over the Scope files found only lines about other codes (`error.rs` 427 and 432, `formatRefusal.ts` 89, the `formatRefusal.test.ts` coverage-lost test), plus the two I changed. Nothing else says D1 or D2 is a placeholder.
- Left alone on purpose: `formatRefusal.test.ts` line 180 is a RECORDED MUTATION, an observation at a commit, so I treated it as history. It quotes `expected '[P6 placeholder] This app cannot open…'`. Lines 137-139 are an older historical comment about all four strings.

**Runs.** Each in its own shared hold, `CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8`.
- `cargo test --locked -p spatial-kernel --test partitioned_refusal_offers_no_declaration --test typed_terminal_codes --test no_generation_in_persisted_artifacts` (one hold): rc 0; 1 passed, 8 passed, 9 passed.
- `cargo test --locked -p spatial-engine --lib error`: rc 0; 4 passed, 209 filtered out.
- `npx vitest run src/admission/formatRefusal src/admission/fixtures` (same hold as the engine run): rc 0; 1 file passed, 15 tests. Only one file matched; `fixtures` matched none.
- `npm run verify` in `frontends/shell`: rc 0, green (the log ends in the test:s5d-verdict suite, 7 of 7 passed).
- `cargo fmt --all --check`: 0. `verify.mjs`: PASS.
- `verify-cites.mjs` (run bare, as CI does; it takes no file arguments): PASS, 3734 files. `verify-quotes.mjs`: PASS, 2 of 2 verified. `verify-test-claims.mjs`: PASS, 901 claims. `verify-mutation.mjs --base 2095a7ac… --head HEAD`: PASS, 3 new tests each have a recorded mutation.
- The verify tool results are statements about the tool's behaviour at the worktree's pre-words-commit head, 4c028ef6.

**Count** (form §7 command over `2095a7ac…HEAD`): 152 insertions + 25 deletions = 177 lines, within the 200 ceiling. 5 files.
- `error.rs` 8/3, `formatRefusal.test.ts` 26/6, `formatRefusal.ts` 17/9, the kernel test 93/0, `KNOWN-LIMITATIONS.md` 8/7 (derived from the totals; `tee` garbled that line).

**Holds, masked.** Four hold lines, each `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (…)`, and four `MACHINE_RELEASED project=<m> … affinity=FF (cores 0-7)`. No MACHINE_WAITING or MACHINE_ERROR lines. C: free ran about 41.5 GB (41531 to 41623 MB), only about 600 MB above the 40960 MB floor. It was not under the floor at any check.

**Done otherwise than the brief says.**
- The first edit and check scripts failed on shell backslash collapse. I rewrote them with `String.fromCharCode(92)` and re-ran; no repository file was affected.
- I ran `git add -N .` once, which only marked intent-to-add. `git status --porcelain` afterwards showed only the three modified files, and the commit staged those three by name.
- The step-5 check normalised whitespace in the quoted message, as the brief says.

**Off-scope noticed.** `formatRefusal.test.ts` line 180 still quotes the placeholder text as a recorded observation (history). Lines 137-139 of the same file still say all four are placeholders (historical).

**State.** Worktree `C:/dev/wt/partref` is clean and pushed. HEAD is 26cb874525d5bdace5035ce564d1f14bc74657d8.

**Self-check.**
- Seams: no cross-module code was written. Only string text, with the same strings the kernel test and vitest already read, so no imagined interface.
- Completion claims: each is backed by a run or script output above.
- Messages: the two strings describe the refusal's behaviour at this commit, covered by the kernel test and vitest.
- Tests: the tests ran green through their assertions.

**Model and logs.** I ran as Sonnet 5.5, claude-sonnet-5-5, with no override and no context handoff. The run logs are in `D:/wt-data/partref/run1.log` to `run4.log`.
