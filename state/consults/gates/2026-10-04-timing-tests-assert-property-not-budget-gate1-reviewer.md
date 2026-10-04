# PR #174 gate 1 — reviewer
Reviewed: cut/timing-tests-assert-property-not-budget @ b73e65d040ae66267e5bb49cb451d86bf2fef501

Tag: node:timing-tests-assert-property-not-budget@g1. Base: main 1c71ebafb6fd829d754b7733073b088575829955 (merge-base of the head and origin/main). Main at review: 3831d4a9edcdf7cf64a43eab4bc4d02664b62313. Form: kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md @ e582d79f085b7e391b636b7094ad47418fddc309 (sha256 of the file d825d9f270a5c2218d0aea85a836ff28b823a2291d340463556ced6b21eae628, identical on main and at the head).

## Verdict: PASS

No S1. One S2 (non-blocking), seven N.

## What was checked

1. Diff, three-dot (origin/main...origin/cut/timing-tests-assert-property-not-budget): kernel/README.md only, 2 insertions, 2 deletions (Last verified at f25aef60 -> 1c71ebaf; the form appended to the preregistrations bullet). §7 counting command prints nothing.
2. Owner's index at 1c71ebaf, every pointer resolved (`git show 1c71ebaf:<path>` / `git grep ... 1c71ebaf`):
   - 37 of 37 backticked file paths exist;
   - 32 of 32 test pointers resolve (`fn <name>` present in the named file; every `mod` segment present);
   - 47 Rust item, crate and constant pointers resolve (12 ceilings constants with their declarations in the named files; SkpHost, StreamRegistry, ticket_only, GenerationRegistry, SessionInvalidator::end_generation, SessionEndReason, session_end_channel, open_dataset, close_dataset, error_of, filter_error_of, terminal_detail_of, Catalog, EngineSourceFactory, StreamParams, OPERATION, bundle, permission::audit, boundary::execute, ViewerAssets, preflight, publish_unguarded, reader_ceilings; engine Dataset, BatchStream, CancelToken, EngineError; data-plane transport, serve (re-exported from server, protocol/data-plane/src/lib.rs:50-51), SourceFactory, BatchSource, SourceCancel, OpenRequest, BatchMeta; skp v0, SkpError, DatasetSessionEnded, SKP_VERSION, StreamHandle (re-exported at protocol/skp/src/v0/mod.rs:16); renderer compile (re-exported from compiled, renderer/src/lib.rs:51), canonical; binaries slice-host, publish-bundle, example verify-bundle);
   - SKP-V0 §1, §3, §5, §7.5, §8, §9.5 headings present, skp/0.5 present;
   - 15 accepted ADRs carry Accepted status lines, ADR-012/019/023/024 carry Proposed;
   - KNOWN-LIMITATIONS items 5, 6, 8, 12, 16, 21, 28, 30 present;
   - the README section Declared composed ceilings (ADR-010 rule 6) present (kernel/README.md:52 at 1c71ebaf);
   - every kernel/*PREREGISTRATION*.md at 1c71ebaf is listed; the index is 37 lines (cap 60).
   No pointer target changes between 1c71ebaf and main 3831d4a9 (`git diff --stat 1c71ebaf origin/main -- kernel engine protocol frontends` empty).
3. Phase R consult: state/consults/2026-10-04-timing-tests-reproduction.md, sha256 df0253b1c13f40e4f346ac7627ba156355d6d9cafaedcc60dd540c478a8d440d on disk and at origin/main (added by 3831d4a9 only), 786 lines, LF.
4. Variant diffs (consult §3). Each extracted from the consult and applied with `git apply` to the 1c71ebaf blobs in a scratch directory outside any repository:
   - base blobs match each diff's index line: skp_admission.rs fc28eb31b79d..., candidate_a.rs cb3073d9870a...;
   - each applies cleanly and the resulting `git hash-object` equals the diff's post-image id: R-1 613f9481, R-1b 80d3f709, R-3 c3fcb6c3, R-3b 377618d9. So each filed diff is the whole difference from 1c71ebaf.
   - Against §2: R-1 waits for two TAG_BATCH, grants no further credit, records the deadline and reads both stamps instead of panicking, counts TAG_BATCH whole run — matches. R-1b adds one CREDIT u32::MAX after host.cancel returns (after the CancelState::Requested assert), keeps every assertion (the trace read moved above the terminal assert, none removed), records code, stamps, after-cancel count — matches. R-1c no diff. R-3 credit 12, factory(12, 4096, 0) unchanged, recv_by records the deadline — matches. R-3b credit 13 — matches. See N-2.
   - Test identities: skp_admission has 10 tests at 1c71ebaf and every log reports 9 filtered out; candidate_a has 11 and every log reports 10 filtered out; candidate_a RECV_DEADLINE is 30 s (protocol/data-plane/tests/candidate_a.rs:201 at 1c71ebaf); the drain's recv_by label matches the logged one (line 222); TERM_COMPLETED 0 and TERM_PRODUCER_FAILED 2 (protocol/data-plane/src/wire.rs:35,37).
5. Run evidence. The tester's raw per-run logs and diffs remain in this session's scratchpad (untracked; evidence, not Authority; not cited by the consult). Against them:
   - the 4 consult diffs are byte-identical (`cmp`) to the tester's R1/R1b/R3/R3b diff files;
   - the 20 verbatim logs in consult §5 (R-1 x10, R-3 x10) are byte-identical to the raw logs (20 of 20, `cmp`, no line-ending change);
   - R-1 table offsets equal the raw VARIANT-OBS lines (10 of 10);
   - R-1b: 11 VARIANT-OBS lines over 10 logs (run 6 two, with one retry-wrapper attempt line, requested 32097100 / observed 32096200), all terminal_code=Some(2), between=0, whole=2, timed_out=false, rc=0 — equal to the table;
   - R-1c: 20 logs, each 1 passed; 0 failed and rc=0, one attempt line in run 10 (18354400 / 18353500) — equal to the table and §6;
   - R-3: 10 of 10 tag_batch_received=12 terminal=None, one RECV_BY-TIMEOUT each; R-3b: 10 of 10 terminal code 0 with empty detail, no timeout;
   - no log contains a panic; no log contains a compile warning.
6. Consult rows against §5, row by row: R-1 10/10 no terminal within 60 s and exactly 2 TAG_BATCH (held); R-1 stamps recorded, present 10/10, no prediction; R-1b TERM_PRODUCER_FAILED 10/10 runs, 11/11 attempts (held); R-1b stamps present 11/11 (held; the one ordering-race attempt recorded, class 2, non-routing); R-1b count 0 <= 7 in 11/11 (held); R-1c 20/20 (held); R-3 12 then no terminal 10/10 (held); R-3b 12 then TERM_COMPLETED 10/10 (held). Routing: §5 condition (R-1 terminal row and R-1b terminal-code row in every run) met, so S1. Correct.
7. Commit ids named by the consult: 1c71ebafb6fd829d754b7733073b088575829955 (full id correct, on main), e582d79f (the form commit), 02dfcff3 (= 02dfcff3a476586e49c9dce33c7e16bf8037158d, ancestor of main). Ordering for §8 item 1: e582d79f committed 2026-10-04T18:31:58Z; 1c71ebaf (the run commit) is its descendant, committed 19:28:01Z; the consult reports filing at 20:10Z; 3831d4a9 committed 20:21:35Z. The throwaway worktree C:/dev/wt/timing-r no longer exists; no skp_admission or candidate_a process is running.
8. Tree check (consult §1, recomputed): `git diff --stat 02dfcff3 1c71ebaf -- kernel/src kernel/tests engine protocol` prints nothing; the form's `-- kernel engine protocol` prints only the form file (203 insertions); `git diff --numstat 02dfcff3 1c71ebaf -- '*.rs' '*.toml'` prints nothing; frontends also empty. See S2-1.
9. S1 routing record: PLAN.yaml:3993-4009 @ 3831d4a9 sha256:65143e3b8fd8c2d8a3dbfd188c0321d8f9f8593daac598385f0924f6feae98e9 — node data-plane-terminal-without-credit, status proposed, depends_on [timing-tests-assert-property-not-budget], gate none, no evidence. Summary carries (i) remedy, skp test unchanged as e2e proof, §21a, ADR-012 Proposed; (ii) Fable item 1 with R-3/R-3b observed result and the consult path; (iii) Fable item 2 with R-1b's 0 in 11 attempts; (iv) Fable item 3 read not run — checked against frontends/shell/src/streaming/adapterWs.ts at main (CREDIT_WINDOW = 4 at line 13, top-up at line 122: matches); (v) §0.3's two queues and the unwatched send, and the two decisions. No code of it on the branch. §8 item 4 clear.
10. §1 and §8, item by item:
    - zero committed code: §7's counting command prints nothing; branch diff is kernel/README.md only (§8 items 2, 3 clear);
    - no fix claimed (consult :774; PLAN node; PR body);
    - no publish-test variant run: none in the consult, none among the tester's logs (§8 item 5 clear);
    - every row has its diff and commit; no run failed; every timed-out run's full output filed verbatim, byte-identical to the raw logs (§8 item 6 clear);
    - the final-step section present (consult §8, nine sentences), each resolved against the logs and steps — I re-resolved sentences 2 to 9 against the raw logs and git; sentence 1 discloses the R-3b departure (see N-1) (§8 item 7 clear);
    - H-S stated no further than R-1 and R-1b observed it (consult :774 @ 3831d4a9 sha256:9cdf57620c19f814821b147adb3c0cedbb6975e46fa0a42442bf3456d1bc8cf0) (§8 item 8 clear; see N-5, N-6);
    - every printed offset is named by its event and the trace clock (consult :28), no verdict, no docs/08 row (§8 item 9 clear);
    - scratch variants called neither tests of record nor mutations (consult :7) (§8 item 10 clear).
11. Pins in the form @ 02dfcff3: all 41 extracted mechanically and recomputed (`git show 02dfcff3:<path> | sed -n '<a>,<b>p' | sha256sum`): 41 of 41 match. The same 41 spans recomputed at 1c71ebaf (the run commit): 41 of 41 match.

## Findings

S2-1 — The form's §2 conditional on a non-empty tree check (kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md:95 @ e582d79f sha256:3440cd7cca1d4f19b905cb82ccefbb9a790b446178658196103d35acb35afa3b) requires naming which is authoritative, the pin or the tree, and re-reading the §0.3 cites against the tree. The consult (state/consults/2026-10-04-timing-tests-reproduction.md:13-22 @ 3831d4a9 sha256:29784ff7dd83c6ba4a83a71d2293f1014975bbafdc29a0b6512d0f8336871821) states the wider diff is non-empty and says pin and tree agree, but names neither as authoritative and states that no §0.3 cite was re-read. My reading: invalidator 2 (form :163 @ e582d79f sha256:d4a4b8978df99d608415c8e62e5df8eef8a3bf86ff534bef13d179cfc04c6566) is not engaged. The only difference is the form file itself, which holds no cited span. Every cited span is byte-identical at both commits (item 11: 41 of 41 at 1c71ebaf), which is the re-read's proof. With no divergence, no authority choice arises. Not blocking. The consult is append-only and byte-identical, so it takes no edit. The closing amendment (D-4) may reference this report for the 41-of-41 recompute. The architect is asked to confirm the reading of invalidator 2.

N-1 — Consult :11 @ 3831d4a9 sha256:143bba4fd59b2d243f9e9eb21a23709cb788c43e9fbf5dd4412f476ab2c42d33 says every variant was reverted before the next. Summary sentence 1 (:778 @ 3831d4a9 sha256:343d09dc95445a42810da2b365a312703a5e6f262cb199aa1c207d4a9790b00e) discloses that R-3b was made from R-3 without a revert. This is an internal inconsistency the final step resolved by disclosure. No row is affected: both diffs reproduce their post-image ids from the 1c71ebaf blob (item 4).

N-2 — Two variant edits go beyond the §2 description's literal list:
- R-1 also removes the post-drain assertions and the ordering-race Err return by an early return. This is disclosed at consult :35 @ 3831d4a9 sha256:b4cb888e1a7d9af1013f0324a95b66cb3162851f517590502d9c2a9986ca500a, and it falls within §2's R-1 wording that the variant reads the trace instead of panicking (form :99).
- R-3 and R-3b also drop `dp.shutdown().await`. This is not stated at consult :209 @ 3831d4a9 sha256:d696e65fdf2896febde8e001c38dcc03463de46f95c39fa0b0dd1e195e3cdf01.
No recorded field depends on either: both edits act after the observation is taken. Neither invalidator 1 nor the routing rows are touched.

N-3 — The form's §5 declared-unchanged list names only kernel/README.md's preregistrations bullet (form :157 @ e582d79f sha256:053a2ab5f907b907df2f40ec1e7f1eb7e868231b6e275ea5433b781aa009386d). §7 and the diff also change Last verified at (form :175 @ e582d79f sha256:98ea66b237b101132ce8a44c3fd5c131d258990f62ce6f382b2a63035ef88e94). The form is internally inconsistent here. The change is the one the Owner's index rule requires, and §7 permits it.

N-4 — §7's file count. The piece's commits on main also touched further files:
- the custodian ledger state/CUT-STATE.md (in e582d79f and 3831d4a9);
- the architect's draft-2 record (in e582d79f);
- the generated CUSTODIAN-QUEUE.* and site/*.
I read §7's enumeration (form :175) as the piece's own files, and the ledger flush and drafting record as custodian records outside it. On that reading there is no overrun, so no class 8 is owed. Flagged for the architect's reading.

N-5 — The PR body (not a record) says, without the 60 s qualifier, that no terminal frame is sent after an SKP cancel with credit exhausted. It also says R-3/R-3b show a normal completion waits for one credit, which §1 (form :86) confines to evidence for the data-plane form. The record carries the limited forms: consult :774, and the PLAN node's (ii), which names the synthetic source. The PR body's count of 68 index pointers differs from my count of 69 file and test tokens (37 + 32).

N-6 — PLAN node element (v) states §0.3's queue ordering as code reading, attributed to §0.3, as §2 (v) requires. In these runs the queue-ahead component was not exercised:
- R-1's PRODUCER_CANCELLED stamp was present in 10 of 10 runs;
- R-1b counted 0 batches after the cancel in 11 of 11 attempts.
The data-plane form should carry (v) as §0.3's reading beside those two observations. This is not a §8 item 8 breach.

N-7 — Consult :774 cites kernel/tests/skp_admission.rs:906 at 02dfcff3 without a hash. It resolves: line 906 at 02dfcff3 is the deadline panic, inside the form's pinned span 903-906 @ 02dfcff3, recomputed in item 11.

## Commands and exit codes

Worktree C:/dev/wt/timing-pr (HEAD b73e65d040ae66267e5bb49cb451d86bf2fef501):
- `git status --porcelain` -> empty, rc 0 (at start and at end)
- `git fetch -q origin` -> rc 0
- `git diff origin/main...origin/cut/timing-tests-assert-property-not-budget` -> rc 0
- `git diff --numstat origin/main...HEAD -- '*.rs' '*.ts' '*.tsx' '*.js' '*.mjs' '*.toml'` -> no output, rc 0
- pointer resolution loops (`git cat-file -e 1c71ebaf:<path>`, `git show 1c71ebaf:<file> | grep`, `git grep ... 1c71ebaf`) -> all resolved, as item 2
- `node scripts/plan/verify-cites.mjs` -> PASS, rc 0 (1285 files)
- `node scripts/plan/verify.mjs` -> verify:plan PASS, rc 0

Main checkout C:/dev/spatial-ide (HEAD 3831d4a9edcdf7cf64a43eab4bc4d02664b62313). Each tool is named by the last commit to change it:
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` -> 440 tests, 440 pass, 0 fail, rc 0
- `node scripts/plan/verify.mjs` (260720226f136d1ec7d72da64656f07d29400ed7) -> verify:plan PASS, rc 0
- `node scripts/plan/verify-cites.mjs` (522e448d55e089b974e115e23f0c72bfc6e1120a) -> PASS, 1286 files, rc 0; 34 loose advisories, none in this piece's files
- `node scripts/plan/verify-quotes.mjs` (f9444a4d99a9087394c55d4b1d4c414a8b11f980) -> PASS, 118 checked, 0 hash-reference errors, rc 0
- `node scripts/plan/verify-test-claims.mjs` (e9735d4749f094f03b69a8b570e8bf10f511c279) -> PASS, 492 claims, rc 0
- `sha256sum state/consults/2026-10-04-timing-tests-reproduction.md` and `git show origin/main:<same> | sha256sum` -> df0253b1...a8d440d both, rc 0
- 41-pin recompute loop at 02dfcff3 and at 1c71ebaf -> 41/41 and 41/41, rc 0
- `git merge-base --is-ancestor 02dfcff3 origin/main` -> rc 0; `git merge-base --is-ancestor e582d79f 1c71ebaf` -> rc 0
- tree checks of item 8 -> as stated, rc 0
- `gh pr checks 174` -> 10 of 10 pass, rc 0 (L1 ubuntu x2, windows cargo x2, sign-off, no profile path, tauri build x2, typecheck/build/vitest/cargo x2)
- `gh pr view 174` -> head b73e65d040ae66267e5bb49cb451d86bf2fef501, OPEN, not draft, MERGEABLE

Scratch directory (outside any repository):
- `git apply` of each of the four extracted diffs onto the 1c71ebaf blobs -> clean
- `git hash-object` of each result -> equals each diff's post-image id
- `cmp` of the consult's diffs and logs against the tester's raw files -> 4/4 and 20/20 identical

No cargo run. Nothing committed, rebased or sent to the remote. The only file written in the repository is this report. In the main checkout, `git status --porcelain` shows untracked entries only, all pre-existing apart from the two gate-1 reports.
