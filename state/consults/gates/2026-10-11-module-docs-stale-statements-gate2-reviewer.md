# PR #209 gate 2 — reviewer
Reviewed: cut/module-docs-stale-statements @ 1c3b4dbec38dca866b004493e52957f359101002

**Verdict: PASS.** I found no Correctness and no Evidence finding. Gate 1's C-1 is fixed at all three sites, and nothing a pin shows contradicts the new sentences (the architect re-gates them in parallel). Every gate 1 Documentation finding in scope is closed. Two new Documentation findings remain, and both must be fixed before the merge, with no re-gate.

The verdict follows `state/directives/2026-10-05-product-first-direction.md:15 @ 1c3b4dbec38dca866b004493e52957f359101002 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751`. The round's allowed scope is Amendment 2 item 1 (`kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:480 @ e445e5cb5747c22a445bec65c0caad5e2010d865 sha256:6b9fd62089912c5ff8ae8af43440faf32b6732e73979daaf4fdbb84475a5531d`) and item 3 (`kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:482-488 @ e445e5cb5747c22a445bec65c0caad5e2010d865 sha256:8cd527f7b41f59b317f73d43ae4cc571b375b9246f7f9ede5f91618e3cca804c`). Commit e445e5cb is on main (rc 0), and it was committed at 16:33:28+02:00, before the first correction commit 6a976e14 at 16:34:53+02:00.

## Correctness

None.

The C-1 sentences, read against what the code and the records show:
- **Where they are:**
  - `engine/README.md:93-96 @ 1c3b4dbec38dca866b004493e52957f359101002 sha256:4aa9c4bd196af401c167ae86c4b9541fc4ef2be0b538ce541689702c5c845801`
  - `engine/src/lib.rs:53-57 @ 1c3b4dbec38dca866b004493e52957f359101002 sha256:1eb2d9b80667b38a442e6f51312cdc2e3402281c3b342d941c25e7c48a65b408`
  - `kernel/src/lib.rs:38-42 @ 1c3b4dbec38dca866b004493e52957f359101002 sha256:bc79aafe11f5df0eec28b824053c8a45e3a57660d5bcb79358ceb33852aedb48`
- **"opens no file for writing" holds for the module's own stream code.** I grepped `engine/src` and `kernel/src` at the head for `File::create`, `OpenOptions`, `fs::write`, `create_dir`, `fs::copy`, `fs::rename`, `tempfile` and `.persist(` (rc 0). Every hit falls into one of these groups:
  - test modules: stream.rs from :2640, descriptor.rs from :453, index.rs from :764, pin.rs from :136, pool.rs from :619, and skp.rs from :2314;
  - the `fixture`-feature module;
  - the tier builder in lod.rs;
  - watch.rs:207, which opens a directory handle with `FILE_LIST_DIRECTORY` access, which is not a write;
  - the bundle writer in publish/;
  - the audit log.
- **The kernel sentence carves out the bundle.** It sits after "Besides the bundle", so the publish run's own writes are outside it.
- **"is not configured off by the engine" holds.** A grep for `temp_directory`, `memory_limit` and `max_temp_directory_size` over `engine/src` and `kernel/src` exited 1, meaning no match. Both cited sections exist at the head and support the sentence:
  - `kernel/CANCELLATION-AND-TRACING.md:208-209 @ 1c3b4dbec38dca866b004493e52957f359101002 sha256:74fbeac86451009d6054d7dfce179bfc2da228b4b144a149f96ac169cce27bd2` (§7)
  - `kernel/RESULTS.md:2066-2069 @ 1c3b4dbec38dca866b004493e52957f359101002 sha256:77c6d236d162490f9be39201074730b578cd85c4f64352d0437f753038fb17b4`
  - `kernel/RESULTS.md:2072-2077 @ 1c3b4dbec38dca866b004493e52957f359101002 sha256:b8b6beef59515aafbf78c9796b81a822b233ffb26a2a37cfef15360583d62ad1` (the §5d subsection)
- **"such as a large sort's"** is supported by §7's sort-spill bullet and by gate 1's C-1 evidence: stream.rs:1474's `ORDER BY`, and DuckDB's default temporary directory.
- **The added rotation is accurate.** `rotate_if_needed` is at `kernel/src/permission/audit/log.rs:407 @ 1c3b4dbec38dca866b004493e52957f359101002 sha256:57ea5fd9b99b4a653ebc72c411c443977ba50a8614a688a6c7fe5c09f0568c90`, and it renames generations at :428 and :432.

## Evidence

None.
- **E1** holds: 185 changed lines, 183 of them comment lines plus the renamed `fn` pair.
- **E5** and **E7** hold.
- **E8** holds, by an extra spot check.
- **E9** is green.
- Details are under Checks 5 and 8.

## Documentation (must be fixed before the merge; no re-gate)

**D-1. Three rewritten lines were not re-wrapped, so each breaks its file's wrap of about 100 columns.**
- The lines:
  - `engine/src/lib.rs:57` is 147 columns. Before this round the file had no comment line over 101.
  - `engine/README.md:394` is 122 columns. The line it replaces, 117d8d5c:391, was 95.
  - `kernel/PERMISSION-BOUNDARY.md:497` is 141 columns.
- `cargo fmt` does not reflow comments, so E5 still passes.
- **Fix:** reflow each line. Every file has room:
  - engine/src/lib.rs is at 45 of 54.
  - engine/README.md is at 101 of 142, and its index lines stay at 2.
  - PERMISSION-BOUNDARY.md is at 10 of 12, insertions only. Its lines 492 onwards are this branch's own append, so E7 against B still holds after the reflow.

**D-2. The PR body's C-1 summary drops DuckDB's condition.** The body says "DuckDB's in-memory default spills intermediates, such as a large sort's, to a temporary directory". By gate 1's evidence (config.hpp:112-115), DuckDB spills only intermediates that do not fit in memory. **Fix:** add the condition, or point to the three sites' wording, which is already conditional.

## Gate 1 findings: closure

- **Architect D-1 / reviewer D-4 (the owner's-index lines): closed.** Both are byte-identical to lead-data's blocks, by script (Check 2):
  - `kernel/README.md:380 @ 1c3b4dbec38dca866b004493e52957f359101002 sha256:9fe2afeab952ae18ccf12139fffac786e6082abd8db489f4116923364e85b346`
  - `engine/README.md:552 @ 1c3b4dbec38dca866b004493e52957f359101002 sha256:af5b5daf8783a40a046fcbec924c39c9d340526cc093aa3de1219db40dc279c2`
- **Architect D-2: closed.** The H2 row now reads "at most one batch after the adapter's receipt of the cancel" (`kernel/README.md:335 @ 1c3b4dbec38dca866b004493e52957f359101002 sha256:c9c0edd93f82059382444a32c391b943ea2bbc4f9b45403170d23772efebac67`). It matches `note_generated`, which counts batches once `observe_cancel`, the binding's receipt, has set the flag (`protocol/data-plane/src/transport.rs` :198-202 and :215-216).
- **Architect D-3: closed.** The rotation is named, and the stream sentence on the same line is qualified (the kernel/src/lib.rs:38-42 pin above).
- **Architect D-4 / reviewer D-1: closed.** The text now reads "Of a projection's columns, only publish preflight refuses" (`engine/README.md:394-395 @ 1c3b4dbec38dca866b004493e52957f359101002 sha256:f0841928bc3a4cd308129e347754490a5b12a6a97030aaead21d9ab8c8b294c4`). The line length is D-1 above.
- **Reviewer D-2: closed.**
  - The new quoted span at `kernel/PERMISSION-BOUNDARY.md:497 @ 1c3b4dbec38dca866b004493e52957f359101002 sha256:6b03f4d6456105c57ee25a1cac58f3b6f95668b93a5a4fb7010d383cd784a786` is byte-identical (cmp rc 0) to the heading text of `kernel/README.md:205 @ 1c3b4dbec38dca866b004493e52957f359101002 sha256:aafebebd1d31b0c0309d21d5c727dda19a23d906ea93a5f7a02fb88e703a8e0d`, without its `## ` prefix.
  - The first bullet under that heading is the exposure position, at `kernel/README.md:240 @ 1c3b4dbec38dca866b004493e52957f359101002 sha256:41e2890bf0022d56d7de25dc11732ca7a7a028e14d7426c3bc2fc48e061a4e57`.
  - The worker departed from the brief by leaving out the "C8" label. That is correct: `kernel/README.md` contains no "C8" (grep -c gives 0).
- **Reviewer D-3: closed.** The PR body now gives 183 `//` lines plus the `fn` pair, and records 178 at 117d8d5c. This matches Check 5.
- **Architect D-5 (not in scope for this check): closed in fact.** The PR body records "The architect's ruling 1: the DX exposure sentence stays removed." by reference.

## Checks

1. **The round's diff.**
   - `git diff --numstat 117d8d5c 1c3b4dbe`, rc 0. Five files: engine/README.md 6/3, engine/src/lib.rs 5/3, kernel/PERMISSION-BOUNDARY.md 1/1, kernel/README.md 2/2 and kernel/src/lib.rs 4/1.
   - I read every hunk. Each one maps to Amendment 2 item 1 (the C-1 sites) or item 3 (the index lines, the H2 wording, the rotation, "Only", the note's section name).
   - Commit 6a976e14 holds the three C-1 sites, with the rotation at the kernel site. Commit 1c3b4dbe holds the rest.
   - Nothing falls outside items 1 and 3.
   - The round's `.rs` changes are 13 lines, all `//`.
2. **The owner's-index lines.** I extracted lead-data's four fenced `text` blocks by awk (rc 0). Each block is one line.
   - `cmp` of block 1 with `117d8d5c:kernel/README.md` line 380: rc 0 (old line).
   - `cmp` of block 2 with `1c3b4dbe:kernel/README.md` line 380: rc 0 (new line).
   - `cmp` of block 3 with `117d8d5c:engine/README.md` line 549: rc 0 (old line).
   - `cmp` of block 4 with `1c3b4dbe:engine/README.md` line 552: rc 0 (new line).
   - At the head, each new line occurs exactly once (`grep -cxF` gives 1, the positive self-test), and each old line occurs 0 times.
   - Within `B..H`, the engine index section (heading at :526) has only the hunk `-521 +552`, 1/1, which is 2 of the allowance of 2. engine/README.md is at 101 of 142.
   - kernel/README.md is at 16 of 24.
3. **Gate 1 Documentation findings.** See the closure list above. Heading byte check: `cmp` rc 0.
4. **The C-1 sentences.** See Correctness. Grep rcs: 0 for the write calls, 1 for the spill settings (no match).
5. **E1, E7, E5.**
   - E1: `git diff -U0 31f77bf5 1c3b4dbe -- '*.rs'` (rc 0), counted with awk (rc 0). 185 changed lines: 183 `//` lines and 2 others, `-    fn an_absent_crs_key_is_not_silently_ogc_crs84() {` and `+    fn an_absent_crs_key_is_not_a_declaration() {`. Holds.
   - E7, CANCELLATION-AND-TRACING.md: B has 254 lines. H's lines 1-254 hash to dfaa9a44f56665f93217711343b0142626bd429cb830a387ee84ad14c3f9b353, the same as B's whole file (equality test rc 0). numstat is 14/0, and H has 268 lines.
   - E7, PERMISSION-BOUNDARY.md: B has 491 lines and ends in a newline. H's lines 1-491 hash to dfa0b4e80ca2daf257966e0c26ebbae750c6cbf832de3d49eff5ec33c93c6cbf, the same as B (rc 0). numstat is 10/0, and H has 501 lines.
   - E5: `cargo fmt --all -- --check`, rc 0.
   - E8, an extra check: B's lines 499, 510 and 519 equal H's 530, 538+3 and 550 (that is, 530, 541 and 550), shifted +31, byte for byte.
6. **Budget.** `git diff --numstat origin/main...origin/cut/module-docs-stale-statements`, rc 0. Merge-base is 31f77bf5, which is B.
   - Totals: 210 insertions and 116 deletions, 326 lines in 16 files, against 450 lines and 18 files.
   - Per file, against §7 with the OPEN-2 additions (`kernel/MODULE-DOCS-STALE-STATEMENTS-PREREGISTRATION.md:405-422 @ e445e5cb5747c22a445bec65c0caad5e2010d865 sha256:21fd4231d518bd084379d09d3af51b407f8238afed05c7e8f22bb7e6b01ea499`):

     | File | Lines | Ceiling |
     |---|---|---|
     | engine/README.md | 101 | 142 |
     | engine/src/lib.rs | 45 | 54 |
     | engine/src/identity.rs | 12 | 14 |
     | engine/src/crs.rs | 19 | 24 |
     | engine/src/geoparquet.rs | 30 | 36 |
     | engine/src/dataset.rs | 6 | 6 |
     | engine/src/envelope.rs | 6 | 8 |
     | engine/src/predicate.rs | 8 | 10 |
     | kernel/README.md | 16 | 24 |
     | kernel/src/lib.rs | 30 | 42 |
     | kernel/src/bundle/mod.rs | 2 | 4 |
     | kernel/CANCELLATION-AND-TRACING.md | 14/0 (insertions only) | 16 |
     | kernel/src/publish/mod.rs | 14 | 30 |
     | kernel/src/permission/mod.rs | 9 | 14 |
     | kernel/src/permission/boundary.rs | 4 | 8 |
     | kernel/PERMISSION-BOUNDARY.md | 10/0 (insertions only) | 12 |

   - No overrun, and §7 is unedited.
   - The form on main differs from B only by Amendment 2's appended lines: 20 insertions and 0 deletions (`git diff 31f77bf5 origin/main --stat`).
7. **Governance at the head.** The last commit to scripts/plan is c813c6ab74ce4c8e32eb63a6357930a4715880a3.
   - `node scripts/plan/verify-cites.mjs`: rc 0, PASS, with 91 loose references advised.
   - `verify-quotes.mjs`: rc 0, PASS, 121 checked.
   - `verify-test-claims.mjs`: rc 0, PASS, 543 tests.
   - `verify.mjs`: rc 0, verify:plan PASS.
   - No advisory names a file in this diff (grep rc 1 for each).
   - No new bare `path:line` appears on the round's added lines: grep rc 1, with a positive self-test at rc 0.
8. **CI.**
   - The first `gh pr checks 209` exited rc 8, with the two windows-latest `cargo test --workspace` jobs pending.
   - I polled every 60 s until they settled, at 15:06:22Z.
   - The final `gh pr checks 209` exited rc 0: 16 of 16 pass at 1c3b4dbe, including windows-latest at 13m43s and 16m8s. The PR's headRefOid is 1c3b4dbec38dca866b004493e52957f359101002.
9. **Low profile.** `git log --format=%B 117d8d5c..1c3b4dbe`: the two subjects carry no outside reference. A grep for `https?://`, `@name` and `github.com` (rc 0) matches only the Co-Authored-By and Signed-off-by trailer lines. There is no link and no @mention outside the trailers.

Final `git status --porcelain` in C:/dev/wt/mdocs: empty (rc 0). HEAD is 1c3b4dbec38dca866b004493e52957f359101002.
