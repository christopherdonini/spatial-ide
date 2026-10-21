*Custodian's filing note (2026-10-21): the worker-high's report for governance D's S9, in C:/dev/wt/psa: the merge commit e01738917ef271ff65ee01740c5fbfca36237b73 (parents f54b54ac and main 54d07268), pushed. Checked: the branch ref, the merge's parents, and the dry run's stdout by its sha256, 154 candidates and the one new row. Its scratch files keep the S9 readings for S10. The run 2026-10-21T04:43:45Z to 04:51:44Z by its transcript (Read 1, Bash 25, Write 1); its one SubagentHandback call, at 04:51:43Z. Extracted by script from that call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is 91700f4daba40a94488dfa05748c19f7894608b4d38084520a128837c3dc915e.*

---

S9 report, governance D (`node:governance-plan-summaries-archive@g8`). Result: the merge and push are done, and the dry run exits 0 and stages nothing. **The candidate list differs from G0 by one id, which is invalidator I6, so this goes to the human before S10.** I stopped before S10.

**Merge**
- Merge commit: `e01738917ef271ff65ee01740c5fbfca36237b73` on `cut/plan-summaries-archive`. Parents: `f54b54ac4a9f9f73b482e865dacdb7e314f126fc`, then `54d072687e79f8cb9a77ca942aa6809dad4e326b` (origin/main).
- The merge exited 0 with no conflict. The message was written with the Write tool to `psas9-merge-message.txt` and passed with `-F`.
- The message ends with the two trailer lines. `--signoff` then added `Signed-off-by: Christopher Donini <donini.christopher@gmail.com>` after them, so the trailer lines are not the last lines.
- Push: `git push origin cut/plan-summaries-archive` in its own Bash call, ordinary update `f54b54ac..e0173891`, **exit code 0**. `origin/cut/plan-summaries-archive` now equals HEAD.
- PLAN.yaml at the merge: blob `83abe8bbc6f9b8007b8694f90b83ac713d444fa1` (equal to `origin/main:PLAN.yaml`), `git cat-file -s` = **703836**. The reading is in `psas9-plan-yaml.txt`, sha256 `6048788c0b61a15bbc2fc3f1ac3c5c79dd07045fd457508412ed08227ce2a559`.

**Dry run** (`node scripts/plan/rotate-plan-summaries.mjs --dry-run` in `C:/dev/wt/psa` at the merge commit; exit 0; porcelain empty afterwards)
- stdout is `psas9-dryrun.stdout`, 158 lines, 29,575 bytes, sha256 `8e2627494aac3d7a14e8412ff6cb5bbfcd79396133aefe389f6ff6a36c6d23d4`. stderr is empty (sha256 `e3b0c442…b855`).
- Header, copied from stdout:
  - `due: no archive was ever added. The archive would be state/cut-archive/PLAN-SUMMARIES-2026-10-21.yaml; P is 54d072687e79f8cb9a77ca942aa6809dad4e326b.`
  - `candidates (154); pointers found (0): none; kept by --keep (0): none`
  - `moved bytes: 412642; the new PLAN.yaml: blob 9b08476312cec3b0a0ae2a7fbcb61a4e2c8c3534`
- Candidates: 154 (G0 had 153). Moved bytes: 412,642 (G0 had 405,897). The difference is 6,745, which is the new row's 6,812 bytes minus a pointer line of 67 bytes. I worked out that 67 from the two figures; I did not check it against the script.
- Comparison with the resolved sheet's 153 ids, run by script (`psas9-cmp.mjs`, output `psas9-g0-compare.txt`):
  - **New (1):** `connection-reuse-recycled-interrupt-flake`. Its row exactly as the dry run prints it:
    `  [connection-reuse-recycled-interrupt-flake] 6812 bytes | current: none | rest: until, next, still, open | nodes: connection-reuse-recycled-interrupt-flake (done) | entries: none | items: none`
  - **Gone:** none.
  - **Order of the 153 common ids:** holds. The new id sits 150th of 154 in the dry run's order.
- The new id is the flake node whose PR #238 merged after G0. Its current-state segment has no marker, and the markers are all in the rest of the summary. That is the custodian's call to resolve.

**S9 readings** (files in my scratch folder; stdout and stderr each by sha256; every exit code was 0)

| Check | Exit | stdout sha256 | stderr sha256 |
|---|---|---|---|
| `verify.mjs --offline` (`psas9-verify.*`) | 0 | 3da2dd041d301452de59264e5dc0505a82e8d14cae55f7531fdfb38f4cffcea4 | a71b66bdaf361ad41e0fc8011acafb95658747d2a29abcd28b2d75dccd517253 |
| `verify-cites.mjs` (`psas9-cites.*`) | 0 | ef2e7f82815fa498f4d94717c98a5f65a50505ec053bb7c9a85dbeb29be0c39b | 4ff38cb3f8e8e97d4ff6978892a36a895efa6a0b4dc641e56a604d3d70246a48 |
| `verify-quotes.mjs` (`psas9-quotes.*`) | 0 | a8791ce7f281a2a98a49480162fd752c500e2afe0f158c79f4ab62e5f5592bd4 | 4433350fba6b737b56ba949ee5be7daa38ab48b075597b9e37b292a277cce67e |
| `verify-test-claims.mjs` (`psas9-testclaims.*`) | 0 | c9fcaeeda0a8be3be286543e6ee222df95dc4746521b03ef3936bf43971ae3b8 | a123ac83d2f157383570b743d77a85d48e195fdb4d145ad5fbdb4ad4e1359b49 |
| `verify-mutation.mjs` (`psas9-mutation.*`) | 0 | a2e835ad047e2682818a98a6d16b0468d17a8761f893d4673c0fd96df262ed34 | 71215befe1f2b5d375c887a8ac5be78e3e1dd55900d635a8798837195d5f8ad3 |
| `queue.mjs --check` (`psas9-queuecheck.*`) | 0 | 8f25d0b08e28531d25ca239b9ec6c872de462ded8859449b7cdd3fae33d5b0f7 | e3b0c442…b855 (empty) |
| `site.mjs --check` (`psas9-sitecheck.*`) | 0 | 00a50575e413af2d505ac0d35d654cad1c87fb29374e8f7a4d535791b1dd5970 | e3b0c442…b855 (empty) |

- Key stdout lines:
  - verify: `PASS — C:\dev\wt\psa\PLAN.yaml agrees with the repository.` The worktree path is in the stdout, so run S10 in the same worktree.
  - cites: `PASS … across 2132 file(s) … (86 loose reference(s) advised above.)`
  - quotes: `129 checked, 98 verified, 30 baselined, 1 advisory`
  - test-claims: `all 574 claimed test(s) across 182 file(s) …`
  - mutation: `all 18 new test(s) have a recorded mutation naming them`
- The verify-mutation and verify-cites stdout counts are pinned to this base. S10 will show the expected cites count rise from 2132 to 2133 for the sheet, per Amendment 8 item 1.
- **CI globs (heavy):** `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` ran inside a shared hold, with `CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8`.
  - Counts: tests 527, pass 527, fail 0, cancelled 0, skipped 0, todo 0 (the S5 count was also 527). The duration was 114 s.
  - Files: `psas9-nodetest-counts.txt` (sha256 `e086766c25b2ba821d2cb51b6a601386fcb40499ba6cc2acaaa2b7f2a6de8e28`), `psas9-nodetest.stdout` (sha256 `80fa59266765b28387d8aa4e6207a3faa74a7ba6998683ad37bf61c426270e7a`), `psas9-nodetest.stderr` (empty).
  - The hold was granted and released. The stdout hash carries per-test timings, so compare the counts file, not the hash.
  - The Bash result did not show an exit code line. 527 passed and 0 failed, and the hold script reported no error, so I read the exit as 0 but did not see it printed.
- **E-R inputs at the merge commit.** Each copy's sha256 equals the blob's sha256 at the merge commit.
  - `psas9-CUSTODIAN-QUEUE.json`: sha256 `d30bf9a2a64270e0178e41dd191941bcf29d151d98697f07b8071ae3611a08bd`, 154,387 bytes.
  - `psas9-CUSTODIAN-QUEUE.md`: sha256 `35bdf1914e152234e6430d25222585ab4036ff53f0f863ccbcc36d6505a9f2c5`, 26,221 bytes.
  - `psas9-site-index.html`: sha256 `b18a0b504cf723b66fe32c0a503d21591cf72e65efd4471e217f4f2585d78b52`, 218,576 bytes.
  - `psas9-site-data-plan.json`: sha256 `5dfe0d3a508a8012e644bd73c3b7f8a1c60577933514c699d9df74930d968add`, 765,440 bytes.
  - `buildSummary` (`psas9-buildsummary.out`, run by `psas9-buildsummary.mjs`, exit 0, empty stderr) on the newest round, `state/questions/round-73.md` (file sha256 `0fcca38cff10e19d775e527aca72da5c8ac1aaa8886c4acf44476634637e8136`). Output: `Question round 73 — 5 items; full text attached (copy-paste ready)`, sha256 `badb01be1506e79b3bccf1926e48a34911ed0c61aa0c847974ba50c34931a6c9`.

**Differences from the brief**
- `--signoff` put the `Signed-off-by` line after the trailers, as described above.
- I ran `verify-mutation` with its defaults (`--base origin/main --head HEAD`), because the brief gave no arguments. Origin/main is an ancestor of the merge, so the range is the branch's own changes.
- The "CI globs' counts" are the `governance-ci.yml` `node --test` step's three globs.
- I used no throwaway worktree, and I only read from the main checkout.
- I did not run the script without `--dry-run`, write the sheet or regenerate anything.

**Final state:** `git status --porcelain` in `C:/dev/wt/psa` is empty, with HEAD = `origin/cut/plan-summaries-archive` = `e01738917ef271ff65ee01740c5fbfca36237b73`. I ran as the harness-reported model Sonnet 5.5 (`claude-sonnet-5-5`), with no model override and no context handoff.
