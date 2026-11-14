Reviewed: PR #309 at 588312e4dcf2f04f9ab0f0d05b5a03497825eca4 (the custodian's filing note, 2026-11-12: the gate, the reviewer, after the architect, whose report it was given from scratch by sha256 with a review packet, PLAN node pre-admission-change-detail-braces, filler entry 3; below, the hand-back byte-identical, one final newline added)
Reviewed: PR #309 at 588312e4dcf2f04f9ab0f0d05b5a03497825eca4 (base a06a70dc), gate, reviewer
Branch: cut/pre-admission-change-detail-braces @ 588312e4dcf2f04f9ab0f0d05b5a03497825eca4

Verdict: PASS WITH NOTES

`<S>` is the custodian's scratch folder. `<M>` is the machine script. The brief's sha256 matched (7c93917e…dd82). So did the packet's (6e5f14f8…3e3c), the sites file's (f8d7f1cf…1217) and the architect report's (54f6fd33…a5d).

## Findings by class

**Correctness:** none.

**Evidence:** none. I re-ran everything myself at H: the four mutations, the four tests, the full workspace suite, fmt, clippy, the shell suite and the governance checks.

**Documentation (must-fix before the merge, does not block):**

- **D1.** `kernel/tests/source_watch_ordering.rs:328-329 @ 588312e4 sha256:` (part of the span 323-329, hash 76c97a56…, check 13).
  - The defect: the clause "— 1 failed, / the other three tests of that piece passing." says "that piece", and nothing in the comment says which piece. The clause cannot be checked from the source alone.
  - Not the human's wording. Not red-line text: it is a test doc comment, not a P6 string.
  - Replacement words for lines 328-329, keeping line 327 as it is:
    ```
    /// this source before admission")` — 1 failed; the other three tests of
    /// `governance/forms/kernel/PRE-ADMISSION-CHANGE-DETAIL-BRACES-PREREGISTRATION.md` passed.
    ```
  - Clause check:
    - "1 failed": the worker's `padb-m1-t1.txt` says `test result: FAILED. 0 passed; 1 failed; …`, and my M1 run says the same.
    - "the other three tests of" the form: T2, T3 and T4 on the form's Tests+mutation line (line 9).
    - "passed": `padb-m1-t3.txt` says `ok. 1 passed`, `padb-m1-t24.txt` says `ok. 2 passed`, and my M1 runs say the same.

**Record findings (in the worker's report as filed on main, not in this PR's diff; for the custodian):**

- "verify-quotes (125 checked... PASS)" is untrue. `padb-quotes.txt` reads `155 checked, 124 verified, 30 baselined`, and my run at H gives the same bytes (cmp 0).
- "Each assertion message names what it compares." is untrue for T3, whose `assert_eq` has no message. The report says so two bullets later.
- "NOTE one deviation" is not true. The filing note lists further departures, two of them undisclosed by the report: the `git stash`, and `cargo fmt` and `npm ci` run outside a hold.

**Notes (not findings):**

- In the T1 and T2 paragraphs, the phrase "`left` being `right` with a `{` prepended and a `}` appended" is a description. It is true of the string values only: the output shows `Some("{…}")` against `Some("…")`.
- The parenthesised assertion messages in those two paragraphs add backticks around `fields.detail` that the output does not have. They are not presented as quotes.
- The `right: Some("…")` spans in T1 and T2 equal the output's `right` lines byte for byte, apart from the comment-line break.

## Checks

**Disk:** `df -h /d` showed 208G available (rc 0). It was the same at the end.

**1. Out-of-scope, first.**
- **ADR: none.** Nothing under docs/ in the diff.
- **Security: none.** No publish, permission or redaction file is touched.
- **Wire: none.**
  - `git diff --name-only B...H -- Cargo.toml Cargo.lock */Cargo.toml */Cargo.lock protocol engine KNOWN-LIMITATIONS.md` gives 0 lines (rc 0).
  - protocol/skp/SKP-V0.md:889-891 @ 588312e4 sha256:659dc74bdbb2449eb6564bf94de6ef87136efb7160ab866aadc673746879338f equals the form's Amendment 1 pin. It declares `fields.detail` and gives no value.
  - `git grep` in protocol/ at H finds neither "a notification arrived for this source" nor "session ended" (rc 1 each).
- **Guarantee.** The product hunks are literals only (padb-g-sites.txt and my diff). No cancellation, ceiling, docs/08, undo or refusal-order code changes. T3's exact text is the only property under test that moves.
- **No new string, dependency or exposure surface.** Four literals changed in place. New strings appear only in tests.
- **No `pub`, variant or code.**
  - A grep of the added lines for `pub` gives rc 1.
  - No enum is touched.
  - The only code literal added is the existing `"engine.source_coverage_lost"` in T2's assertion.
- **The six files.** `git diff --name-only B...H` (rc 0) lists exactly the six Scope files.

**2. The words** (my script padb-gr-words.mjs, rc 0, WORDS-OK).
- At skp.rs:1031, 1543+2, 1682+2, lib.rs:546+2 and terminalShapes.ts:58+2, each H line equals B with only the `{` before `[P6 placeholder]` and the next `}` removed.
  - Byte delta: 2 at each site.
  - The character after the removed `}`: `"` in the Rust files and `)` in the TS file.
  - No brace is left in the H lines.
  - Each detail starts with `[P6 placeholder]`.
- The grep at B: 7 lines (terminalShapes.ts:58, lib.rs:546, skp.rs:1031, 1543, 1682, 4367, typed_terminal_codes.rs:366). At H: 1 line, skp.rs:4367. rc 0 both.
- K15, skp.rs:4363-4368 at H: sha256 3aafacb309fb8235f9b229e7af1146561f4acacfea13836757cec430dacbde06. This equals a8125f81's pin.

**3. The seam** (padb-gr-seam.mjs, rc 0).
- The TS constant comes from 5 concatenated parts. T3's literal was resolved with `\`+LF+leading whitespace dropped.
- Both values: 395 bytes, sha256 6d6a308e1b286e943de45915d4bef5cc8ff4343b0c74812227afde94ea0ec586. They are byte-equal, and the hex of both was printed.
- The constant equals T3's whole text, bytes 0..395 of 395.
- T4's literal resolves to the same 395 bytes and the same hash (padb-gr-t4.mjs, rc 0).

**4. Tests against the Tests+mutation line** (read at H).
- **T1** (source_watch_ordering.rs:360-364): `refused.fields.get("detail").map(String::as_str)` == `Some("[P6 placeholder] a notification arrived for this source before admission")`. It comes after the code check at :359.
- **T2.**
  - Its name is the form's name exactly.
  - Its route: `open_through` (the real `open_dataset`), then `viewport_query_resolve`, then `viewport_query_mint`, then `host.invalidator.end_generation(…, SessionEndReason::CoverageLost)`, then `viewport_query_attribute`. These are the product's own three steps, in `viewport_query` (skp.rs:1409-1416).
  - It asserts the code `engine.source_coverage_lost` and the brace-free detail.
- **T3:** the whole `"<code>: <message>"` text.
- **T4:** a whole-detail `assert_eq`.
- No `#[ignore]`, cfg, sleep, retry, timeout or Duration in the added lines (grep rc 1).
- Assertion messages: T1, both of T2's and T4's name what they compare. T3 has none (packet item 3).

**5. The doc comments** (padb-gr-docs.mjs against padb-m1..m4).
- Each paragraph names the full commit 74fd4f1de5e4400f0d0472a0d5c522e2468a08c7.
- T2's paragraph names its test. T1, T3 and T4 say "this test" in their own docs.
- Each failing name, "1 failed", each assertion message and each side's brace position match the outputs. All four are descriptions, not copies: no quote marks around the output text, except the `right:` spans, which match byte for byte.
- D1 is the one clause that does not resolve.
- kernel/README.md:390 adds the form path, and the path exists at H. Line 361 says the pointer was checked at 74fd4f1d, and the form exists at 74fd4f1d (`git cat-file -e`).
- `node scripts/plan/verify-mutation.mjs --base B --head HEAD` (tool @ 7d24ed15) gives rc 0: `verify:mutation PASS — all 1 new test(s) have a recorded mutation naming them.` This is a self-check, not an observation.

**6. Mutations, observed by me on the committed head.**
- Each edit was made by padb-gr-mut.mjs, after a dry run that reproduced B's lines exactly.
- Each was followed by `git diff` (shown) and `git checkout -- <file>`, and the porcelain was empty (0 bytes) after each.
- Before each edit, the brace-free literal was shown at its site.

- **M1** (skp.rs:1031): T1 rc 101, T3 rc 0, T2/T4 rc 0.
  - `thread 'a_signal_between_arming_and_admission_refuses_the_open' (20760) panicked at kernel\tests\source_watch_ordering.rs:360:5:`
  - `assertion `left == right` failed: K6: the refusal's fields.detail against the brace-free pre-admission literal`
  - `  left: Some("{[P6 placeholder] a notification arrived for this source before admission}")`
  - ` right: Some("[P6 placeholder] a notification arrived for this source before admission")`
  - `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 15 filtered out; finished in 0.06s`
  - T3: `test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 7 filtered out; finished in 0.06s`
  - T2/T4: `test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 187 filtered out; finished in 0.11s`
- **M2** (skp.rs:1543-1544): T1 rc 0, T3 rc 0, T2/T4 rc 101.
  - `thread 'skp::ticket_drop_under_lock_regression::a_coverage_loss_between_mint_and_attribution_refuses_with_its_own_code_and_placeholder_detail' (13164) panicked at kernel\src\skp.rs:4804:9:`
  - `assertion `left == right` failed: T2: the refusal's fields.detail against the brace-free attribute-step literal`
  - `  left: Some("{[P6 placeholder] this dataset's session ended while this query was being prepared}")`
  - ` right: Some("[P6 placeholder] this dataset's session ended while this query was being prepared")`
  - `test result: FAILED. 1 passed; 1 failed; 0 ignored; 0 measured; 187 filtered out; finished in 0.09s` (T4 ok)
  - T1: `test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 15 filtered out; finished in 0.21s`
  - T3: `test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 7 filtered out; finished in 0.07s`
- **M3** (skp.rs:1682-1683): T1 rc 0, T3 rc 101, T2/T4 rc 0.
  - `thread 'a_coverage_lost_pre_check_refusal_carries_its_typed_code_and_exact_text' (22980) panicked at kernel\tests\typed_terminal_codes.rs:369:5:`
  - `assertion `left == right` failed`
  - `  left: "engine.source_coverage_lost: [P6 placeholder] refused: the advisory watch on this source lost coverage ({[P6 placeholder] this dataset's session ended when the advisory watch on its source lost coverage}). This is not a statement that the file changed — the OS notification stream this session was relying on stopped reporting, and this check cannot see whether the file changed while it was not"`
  - ` right: "engine.source_coverage_lost: [P6 placeholder] refused: the advisory watch on this source lost coverage ([P6 placeholder] this dataset's session ended when the advisory watch on its source lost coverage). This is not a statement that the file changed — the OS notification stream this session was relying on stopped reporting, and this check cannot see whether the file changed while it was not"`
  - `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 7 filtered out; finished in 0.05s`
  - T1: `test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 15 filtered out; finished in 0.21s`
  - T2/T4: `test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 187 filtered out; finished in 0.10s`
- **M4** (lib.rs:546-547; the mutated blob is c8f5b273, B's own blob): T1 rc 0, T3 rc 0, T2/T4 rc 101.
  - `thread 'skp::ticket_drop_under_lock_regression::a_coverage_loss_between_liveness_and_redeem_keeps_its_own_code' (80176) panicked at kernel\src\skp.rs:4993:9:`
  - `assertion `left == right` failed: R3: the redeem step's refusal against the whole brace-free coverage-lost terminal`
  - The left and right lines are byte-identical to M3's two above.
  - `test result: FAILED. 1 passed; 1 failed; 0 ignored; 0 measured; 187 filtered out; finished in 0.10s` (T2 ok)
  - T1: `test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 15 filtered out; finished in 0.20s`
  - T3: `test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 7 filtered out; finished in 0.07s`
- The `--lib` filter ran exactly T2 and T4 every time: two `test skp::ticket_drop_under_lock_regression::a_coverage_loss_between_…` lines, with 187 filtered out.
- As predicted: each mutation failed its own test and none of the other three. No survivor.

**7. Unmutated at H** (run before check 6, to warm the build): all three commands rc 0.
- `1 passed; … 15 filtered out`
- `1 passed; … 7 filtered out`
- `2 passed; … 187 filtered out`

**8. The suite at H.**
- `cargo fmt --all -- --check`: rc 0.
- `--list`: rc 0, 1140 `: test` lines, against 1139 in the worker's padb-list-base.txt.
  - Added: exactly `skp::ticket_drop_under_lock_regression::a_coverage_loss_between_mint_and_attribution_refuses_with_its_own_code_and_placeholder_detail: test`.
  - Removed: none.
  - My list is byte-identical to the worker's padb-list-head.txt.
- `timeout 3600 cargo test --workspace --locked`: rc 0. 122 `test result:` lines, 1074 passed, 0 failed, 66 ignored (1074+66 = 1140). No FAILED line.

**9. Clippy, recorded and not claimed.**
- `cargo clippy --locked -p spatial-kernel --all-targets -- -D warnings`: rc 101.
  - `renderer\src\canonical.rs:303:20` (manual `!Range::contains`) and `renderer\src\style.rs:10:5` (doc list item without indentation). spatial-kernel was not reached.
- One extra run without `-D warnings`: rc 0. spatial-kernel was linted, with 6 warnings at skp.rs:277, lib.rs:415, lib.rs:490, permission/boundary.rs:536, publish/mod.rs:839 and bin/publish-bundle.rs:149. None is in an added line.
- No CI job runs clippy. `git grep -i clippy 588312e4 -- .github` hits only a comment in rust-fmt.yml that says it is not clippy.

**10. The shell at H.** Two holds, one command each, under the one-command-per-hold rule:
- `npm run typecheck`: rc 0.
- `npm test`: rc 0. Test Files 111 passed (111), Tests 1456 passed (1456), 0 failed.

**11. Size and bytes.**
- numstat (rc 0): terminalShapes.ts 2/2, README 2/2, lib.rs 2/2, skp.rs 75/5, source_watch_ordering.rs 13/0, typed_terminal_codes.rs 8/2. 102 added and 13 deleted, 115 in all, against the declared 120.
- 102 added lines: 0 with CR, 0 with a tab.
- Non-ASCII: only U+2014.
  - Two lines (terminalShapes.ts and typed_terminal_codes.rs) replace lines that carry it.
  - Five are pure additions with no replaced line: three "— 1 failed" comment endings, the same form K15 uses, and T4's literal, whose product Display carries the U+2014.
  - Not a finding.
- All six files end with LF at H.

**12. Governance checks at H** (each tool's last commit at H in brackets).
- node --test suite: rc 0, tests 598, pass 598, fail 0.
- verify-cites [6f29ce60]: rc 0, PASS, 2891 files.
- verify-quotes [d8369ef8]: rc 0, `PASS — 155 checked, 124 verified, 30 baselined, 1 advisory, …`.
- verify-test-claims [494cea7b]: rc 0, PASS, 793 claimed.
- verify.mjs --offline [494cea7b]: rc 0, PASS.
- forms-layout [4d28aac3]: rc 0, PASS, 220 files.

**13. The architect's report.**

Pins, each at 588312e4 unless marked, from whole lines with their LFs (padb-gr-pins.mjs, rc 0):
- skp.rs:1031 452ed88e233c9c72e3b681200d0e7d77f908b45580ee11192d9df7c6ba2df93b
- skp.rs:1543-1544 5be08453736d5fd94989f36b470fc4b9d2fcd6204e376a8bdc5b79cfde755c06
- skp.rs:1682-1683 3a35c136d4e2c073b46e345d183be84bae0882961459394c27ba7b3cf999af97
- lib.rs:546-547 508109d187972e713c2d89a9e8d2e4d24bf6f9eccfd599a35e26f717d3449da8
- terminalShapes.ts:58-59 5fb55840526c620bfc09f0dd4f210f6800dc4541005b44f0b046e7cfa4fb7372
- governance/forms/engine/SOURCE-WATCHER-PREREGISTRATION.md:402 @ c7ea7202 e5e74985a9b4182d8f89cb5ec64bd7e3f0c5f03c1f614fd5566074d4975af192 (the Placeholders row; equals the form's 7591cdad pin)
- skp.rs:2114-2115 d8f03e346ec446bf464870cb01c3593ef0923df4a0ac03fc3cf2140845c9bf50
- skp.rs:2162-2164 510695a86c771b5ae6eca42d4cf852550620e1307607723724ed12cf5b226887
- skp.rs:1028-1036 68556e5fcc94e0fe5883da7ac4d4b0419188f039f42484589c605ab0d43a0627
- skp.rs:1537-1547 9ede125aa17bb633433b370cc0eb391cb4dbeab495685fee9f994818ee4e429d
- skp.rs:1675-1686 cbfcf83c9c207d35cf7f17f188d5b50e976c879ecf3dd00e3ff7910e53aad665
- lib.rs:544-550 4b02ac56037de91e480d8e0ca764e1c510471ba04d770277f830a7ff52f22750
- SKP-V0.md:889-891 659dc74bdbb2449eb6564bf94de6ef87136efb7160ab866aadc673746879338f
- source_watch_ordering.rs:359-364 658228e8eaf5928163fd53498e8ed4794eeff3bf5ef8a83abefe7c5cc1f42198
- skp.rs:4783-4811 8a072fcbbacc1318a8096de28038a7fc3a8e7aaae8266169d37d48d3f16b51df
- skp.rs:1513-1553 d5f4d8efc298b8b9c8ca37ba8d1b99f838001cbbd3dababd92261286c4eb8a00
- skp.rs:622-635 ef508659d750f4c953741cfdd6a01d2564ee00ac1d31f4d91ecf669b6f1aef87
- typed_terminal_codes.rs:368-376 a842a81f13f30390ec6adbd56c51c7d766526d85d9bb4e16f2326a1cc5b5240c
- engine/src/error.rs:425-431 57e89a88bff2636c36772ba8d593ec15901f7f690e006b05b6717c5a09262c8d
- skp.rs:4993-5001 c4a7610f37dbdabd49a4e9f0b6e1b9302a4156936871879e371b73c71fb3183b
- lib.rs:513-553 f059869448d948de5dae40821fb1572dd571c3339d598e48de8fbdf5f8f8a640
- lib.rs:563-571 7bd736c021040543ec58e853b666cf205c68f951549d2b94da59c9342ace8b04
- source_watch_ordering.rs:323-329 76c97a5643d19198d95ce1f7a03665f4d6d29de3203af321202e583da7953fc3
- skp.rs:4764-4771 677a380bfd9e4c694987b195da59458dc51bfed0674ab3374c38fbdf06aa958e
- typed_terminal_codes.rs:316-320 392c9e1e561c94847167bb8ad6cea7f0304c7a3b88fccdc560f711f75a9b1168
- skp.rs:4973-4978 3dd335f8208d2827637b853f0b8d04a970b6426078f9b1e0fc42823227601f24
- skp.rs:4363-4368 3aafacb309fb8235f9b229e7af1146561f4acacfea13836757cec430dacbde06
- kernel/README.md:390 55647c24b12ae4c7947a83a47267a6e5535cb88ec8432cf3a10a6e2900c0d4c6
- kernel/README.md:361 cb9d62bca9c57af647b3b07b1a392d828db7d855196d821699f9345f74bb9379
- terminalShapes.ts:56-61 882f7de3485267cc1588af896abaf11c2b4667d3b6c95a3bb82dbf4434034a5e
- frontends/shell/src/streaming/liveTicketSet.test.ts:163-168 4afcd6ffc3efe7b677230810e1cd692b33e1aa795972456db5e0cfcefec3f10f (unchanged from the form's pin)

Each span holds what the architect says it holds, except as disputed below.

Disputed:
- **(a) Check 6's clippy closure does not exist.** "CI's clippy at the head closes that too" is untrue: no workflow runs clippy. The point closes instead by my check 9, recorded and not claimed.
- **(b) Check 2's error_of cite is half the claim.** "error_of builds fields.detail from the same variant (2114-2115 and 2162-2164)": 2162-2164 is the `SourceChanged` arm only. The three coverage-lost sites go through skp.rs:2255-2257 @ 588312e4 sha256:c18b26231e620310acb22e19516718481cedbd7437e4097888dbe8fa42030fbb. The claim is true; the cite covers half of it.
- **(c) One main-checkout pin, not two.** "The two main-checkout pins are marked @ c7ea7202": the report has one.
- **(d) N-c undercounts.** It names two lines over 100 columns. Added lines over 100 columns also include skp.rs:4767 (103), :4773 (the fn signature, 101) and :4974 (101). Cosmetic, and fmt gives rc 0.
- **(e) Copied or rebuilt cannot be told.** "That `right` value is … rebuilt by the worker and not copied from output": it equals the output's `right` line byte for byte, so the two cannot be told apart.

Confirmed:
- T2 is a private `#[test]` (4772-4773).
- `require_live` is at :1472.
- `viewport_query_attribute` has one `SourceCoverageLost` construction (:1542-1543).
- `attribute_ticket` returns false with no live entry (:628-630).
- The constant's only importer is liveTicketSet.test.ts:13/:164. Its matcher `isSessionEndedRefusal` matches on code only (liveTicketSet.ts:80-85).
- At H, the whole tracked tree has `{[P6 placeholder]` only in the form, the draft and skp.rs:4367.
- The skp.rs hunks above 4363 are one-for-one.
- N-a is confirmed.
- N-b: PR #307's 9398efc6 has two parents (c91e087f, 708a3d5c), so a merge commit. 74fd4f1d stays reachable under the same method.
- Its check-6 weighings are confirmed: each departure breaks the brief, not the form. The tree at H now has fmt, the full suite, clippy (recorded) and the shell suite run by me.

**14. The worker's report against its outputs.**
- True, by the outputs:
  - base grep 7;
  - the base failures and their line numbers, at T's layout;
  - T-runs and fin2 all pass;
  - the M1-M4 lines and summaries;
  - the list, 1139 to 1140;
  - workspace 122/1074/0/66;
  - the clippy diagnostics;
  - vitest 111/1456;
  - node suite 598/0;
  - the verify-mutation PASS;
  - numstat 115;
  - name-only at 74fd4f1d, 5 files with no README;
  - K15:4367 sha256 a506c824… at B and at H;
  - all four commits carry a Signed-off-by trailer.
- Untrue: the three sentences under the record findings above.
- Unresolvable from the outputs: "cargo fmt changed nothing" and the fmt re-run at the final head, since there is no fmt output file. My fmt at H gives rc 0.
- Timing: `padb-T-*.txt` (mtime 08:56:07 +01) predates commit 74fd4f1d (08:56:52 +01), so the "T" runs were at the working tree before the commit. The mutations (08:57-09:00) postdate it.
- Nothing follows for the piece from these or from the filing note's departures. The stash list is empty, and every result the form needs I re-observed at H.

**15. CI**, read 2026-11-12T09:43:34Z and again at 10:25:00Z.
- `gh pr checks 309` (rc 8 at the first read, rc 0 at the second): 18 lines, all pass at the second read.
- Each run's headSha is 588312e4dcf2f04f9ab0f0d05b5a03497825eca4, conclusion success:
  - 43191494425 DCO
  - 43191494479 Rust fmt
  - 43191494431 Exposure scan
  - 43191494322 Ported notices
  - 43191494566 Governance
  - 43191494424 Product Rust: in_progress at 09:43:54Z, success at 10:25:00Z
  - 43191494536 Product shell
  - 43187990337 Governance (push)
  - 43187990267 Product shell (push)
  - 43187990260 Product Rust (push)
  - 43187990176 Ported notices (push)
  - 43187990144 Rust fmt (push)

**16. Porcelain afterwards:** `status --porcelain --untracked-files=no` is empty (0 lines) and HEAD is 588312e4dcf2f04f9ab0f0d05b5a03497825eca4.

**My own departures:**
- One stray write outside scratch: a 232-byte copy of SKP-V0.md:889-891 to the temp root's `x`, removed in the next call (rm rc 0).
- Foreground hold calls ran with the tool's 600 s maximum and `-MaxWaitMinutes 8`, not 3600 s. The `--list`, workspace and verify-quotes calls ran in background mode.
- The unmutated T3 and T2/T4 holds ran at the same time, both shared.
- The extra clippy run without `-D warnings` is named in check 9.

## For the human
- No P6 wording finding: no span changed beyond the eight braces (check 2).
- OPEN-1 to OPEN-7 were taken (A) by the custodian under your direction of 2026-10-31, item 4, for your review on return (the form's settlement).

## The packet's gaps
- Whether any CI job runs clippy. Packet item 5.2 and the architect both assumed one; none does.
- The tool commits for verify-mutation, verify-quotes, verify-cites, verify-test-claims, verify.mjs and forms-layout (computed by me, check 12).
- The main merge method, which N-b depends on (inferred from #307 only).
- That the `T-` outputs were taken before commit T existed (found from mtimes).
- The brief's check 10 says "in one shared hold" while its machine rules say one command per hold call. I used two.

## Hold lines (all SpatialIDE, `also=` elided)
24 holds, each `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> (commands started from now on inherit it; release when done)` and each `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:<pid> affinity=FF (cores 0-7)`. The pids, in order:
- 63952, 65464, 81256: unmutated
- 82888, 63636, 28860: M1
- 41752, 43368, 27416: M2
- 8416, 81128, 24788: M3
- 7268, 46232, 56616: M4
- 33304: fmt
- 68032: list
- 77864: workspace
- 72276: clippy -D
- 70104: clippy warnings
- 78852: typecheck
- 8636: npm test
- 79992: node suite
- 69116: verify-quotes

No hold was refused, and no exit code was 96-99.

## Background shells left
None. b6ggf41yz, byps5u71g and ba0xtiwsx completed with exit 0. My two wait loops, bom3baksz and b3plu7ews, were moved to background by the harness and ended at their hard timeouts. No process I started is running.

## Model
claude-opus-5-5 (Opus 5.5), as the harness reports it.
