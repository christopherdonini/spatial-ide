*Custodian's filing note (2026-10-21): the worker-high's report for governance D's S10, in C:/dev/wt/psa: the move committed as 120cd55dadd68ab4670776f6882b3e028624edf2 (parent e01738917ef271ff65ee01740c5fbfca36237b73) and pushed. Checked by git: the branch ref and parent; PLAN.yaml's and the archive's blob ids; the sheet's sha256; the archive's 203 lines and its source line; PLAN.yaml's 100 insertions and 100 deletions; the seven paths; the 291,520 moved bytes by cat-file; P's PLAN.yaml blob equal to S9's. Its calls were matched to its transcript: the script's run, the commit (rc 0), the push (rc 0), D1-b and the shared hold. The run 2026-10-21T08:22:04Z to 08:32:43Z by its transcript (Read 7, Bash 23, Write 3); its one SubagentHandback call, at 08:32:42Z. Extracted by script from that call, with nothing changed except one final newline. Its sha256, from line 5 to the end, is c568eb965e73b882908e209c539d506ec304bc0f084874fef4b4798175d9d195.*

---

S10 report, governance D (`node:governance-plan-summaries-archive@g8`). The move is committed and pushed. D1-b, E-P, E-R and E-M (c) all hold. The only differences are the ones Amendment 8 item 1 names, plus two points below: the archive's P differs from S9's dry run, and the CI-glob exit code was not seen. I stopped before the reviewer; no PR action.

**Step 0.** All checks held. HEAD = origin/cut/plan-summaries-archive = e01738917ef271ff65ee01740c5fbfca36237b73, porcelain empty, and HEAD:PLAN.yaml = origin/main:PLAN.yaml = 83abe8bbc6f9b8007b8694f90b83ac713d444fa1.
- **Difference:** `origin/main` in this worktree now resolves to **ab9a4b4f957aaf61dedd5e08446bf98fdca55d7f**, not 54d07268. Someone fetched after S9 (I did not). The PLAN.yaml blob is unchanged. So the script's P, and the archive's `source` commit, is ab9a4b4f, where S9's dry run printed 54d07268.

**Step 1.** The sheet was copied to `state/drafts/plan-summaries-d-obligations.md`. Its sha256 is 9ed1c66ed6ab64ce5068aedeb91e2601d545a99a9fc2e17835f8b3667075a977, as required. The keep file holds 54 ids with no trailing newline.

**Step 2.** `rotate-plan-summaries.mjs --keep "$(cat psas10-keep.txt)"` exited 0 with empty stderr. Its stdout, as printed:
```
rotate-plan-summaries: staged:
M	PLAN.yaml
A	state/cut-archive/PLAN-SUMMARIES-2026-10-21.yaml
blobs: PLAN-SUMMARIES-2026-10-21.yaml 56ba73a11869c682f177be816f7c4bc30511b1d1, PLAN.yaml 841e0527f16aac1d770a035424ddd52c5526bc03; P is ab9a4b4f957aaf61dedd5e08446bf98fdca55d7f; moved 100 summaries, 291520 bytes.
Next: node scripts/plan/queue.mjs and node scripts/plan/site.mjs (no site/data/build-health.json present), git add CUSTODIAN-QUEUE.md CUSTODIAN-QUEUE.json site/index.html site/data/plan.json and the sheet; run verify-cites, verify-quotes, verify-test-claims and verify --offline on this staged tree and on HEAD and compare; when equal, git commit -s -m "chore: move done nodes' summaries from PLAN.yaml to state/cut-archive/PLAN-SUMMARIES-2026-10-21.yaml" and push; when they differ, restore the index and every path from HEAD, commit nothing, and tell the human.
```
The 100 moved ids and none of the 54 kept ids intersect (0 in common), so I9 does not fire. This agrees with Amendment 6's 99 plus the one new id (`connection-reuse-recycled-interrupt-flake`): 284,775 + 6,745 = 291,520.

**Step 3.** `site/data/` held `health.json` and `plan.json` and no `build-health.json`. `queue.mjs` and `site.mjs` both exited 0. I sent their stdout and stderr to /dev/null rather than to files, which departs from your brief. After `git add`, the porcelain showed exactly the seven staged paths (M CUSTODIAN-QUEUE.json, M CUSTODIAN-QUEUE.md, M PLAN.yaml, M site/data/plan.json, M site/index.html, A archive, A sheet).

**Step 4.** The staged tree compared against S9's readings, all four exit 0:
- verify.mjs --offline: stdout and stderr hashes equal S9's.
- verify-quotes: stdout and stderr hashes equal S9's.
- verify-test-claims: stdout and stderr hashes equal S9's.
- verify-cites: stderr equals S9's; stdout differs only in the file count, 2132 to 2133. That is the sheet's file, the piece's own per Amendment 8 item 1.
- The gated findings are equal.

**Step 5.** Commit **120cd55dadd68ab4670776f6882b3e028624edf2**, `git commit -s -F` exit 0, with no hook refusal. Subject: `chore: move done nodes' summaries from PLAN.yaml to state/cut-archive/PLAN-SUMMARIES-2026-10-21.yaml`. The trailers are in the body and `--signoff` appended its Signed-off-by line after them. Seven files changed, 630 insertions and 206 deletions. The push, in its own Bash call, was an ordinary update `e0173891..120cd55d`, **exit 0**. Origin now equals HEAD.

**Step 6, D1-b at 120cd55d.** Files are `psas10-<what>.stdout` and `.stderr` in my scratch folder, S9's are `psas9-<what>.*`, and every exit code was 0.

| Check | stdout sha256 | stderr sha256 | Against S9 |
|---|---|---|---|
| verify --offline (`psas10-verify`) | 3da2dd041d301452de59264e5dc0505a82e8d14cae55f7531fdfb38f4cffcea4 | a71b66bdaf361ad41e0fc8011acafb95658747d2a29abcd28b2d75dccd517253 | both equal |
| verify-cites (`psas10-cites`) | 5ca0c6c9a1490538bea4b645205d8211ffce24065905465fafdf9d60edd7f91e | 4ff38cb3f8e8e97d4ff6978892a36a895efa6a0b4dc641e56a604d3d70246a48 | stdout differs, stderr equal |
| verify-quotes (`psas10-quotes`) | a8791ce7f281a2a98a49480162fd752c500e2afe0f158c79f4ab62e5f5592bd4 | 4433350fba6b737b56ba949ee5be7daa38ab48b075597b9e37b292a277cce67e | both equal |
| verify-test-claims (`psas10-testclaims`) | c9fcaeeda0a8be3be286543e6ee222df95dc4746521b03ef3936bf43971ae3b8 | a123ac83d2f157383570b743d77a85d48e195fdb4d145ad5fbdb4ad4e1359b49 | both equal |
| verify-mutation (`psas10-mutation`) | a2e835ad047e2682818a98a6d16b0468d17a8761f893d4673c0fd96df262ed34 | 71215befe1f2b5d375c887a8ac5be78e3e1dd55900d635a8798837195d5f8ad3 | both equal |
| queue.mjs --check (`psas10-queuecheck`) | 8f25d0b08e28531d25ca239b9ec6c872de462ded8859449b7cdd3fae33d5b0f7 | e3b0c442…b855 (empty) | both equal |
| site.mjs --check (`psas10-sitecheck`) | 00a50575e413af2d505ac0d35d654cad1c87fb29374e8f7a4d535791b1dd5970 | e3b0c442…b855 (empty) | both equal |

- **The one stdout difference** is verify-cites. `diff psas9-cites.stdout psas10-cites.stdout`:
  ```
  1c1
  < verify:cites PASS — every rooted (in-tree) path:line reference across 2132 file(s) resolves. (86 loose reference(s) advised above.)
  ---
  > verify:cites PASS — every rooted (in-tree) path:line reference across 2133 file(s) resolves. (86 loose reference(s) advised above.)
  ```
- **The verify-mutation difference:** I ran it with an explicit `--base 54d072687e79f8cb9a77ca942aa6809dad4e326b --head HEAD`. S9 used the default `--base origin/main`, which then was 54d07268 and now resolves to ab9a4b4f. Because of the explicit base, the range is the same one S9 ran, and its output is byte-identical to S9's.
- **CI globs (heavy):** `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` ran inside a shared hold, with `CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8`. The hold was granted (cores 0-7) and released.
  - Counts: tests 527, pass 527, fail 0, cancelled 0, skipped 0, todo 0.
  - `psas10-nodetest-counts.txt` is byte-equal to S9's (`cmp` 0), sha256 e086766c25b2ba821d2cb51b6a601386fcb40499ba6cc2acaaa2b7f2a6de8e28. Stderr is empty.
  - The full stdout carries per-test timings, so I compared the counts file, not its hash (this run's sha256 is 6f819e19c789d17a28ce6aebd892486e2db36d1ee5e89e429807140444e74830).
  - As at S9, the Bash tool did not print an exit-code line for the hold shape. fail 0 and an empty stderr let me read it as 0, but I did not see it printed.

**Step 7, E-P** (S9 = e01738917ef271ff65ee01740c5fbfca36237b73, S10 = 120cd55dadd68ab4670776f6882b3e028624edf2):
- `git diff --numstat S9 S10 -- PLAN.yaml` gives **100 insertions, 100 deletions**, so N = 100. PASS.
- The archive has **203 lines**, and 3 + 2N = 203. PASS.
- `git diff --name-only S9 S10` lists exactly the seven paths: CUSTODIAN-QUEUE.json, CUSTODIAN-QUEUE.md, PLAN.yaml, site/data/plan.json, site/index.html, the archive, and the sheet. PASS.
- R1 to R3 on the real pair: `verifyMove` from the S10 script, called on S9's PLAN.yaml, S10's PLAN.yaml and the archive (script `psas10-verifymove.mjs`). Output:
  ```
  moved ids 100 changed lines 100 line counts 5649 5649
  all newLines equal the pointer line: true | isPointer: true
  problems: []
  ```
  PASS. I took the moved ids from the archive and the line indices from the S9-to-S10 line diff. `verifyMove`'s own archive-bytes check then ties each id to its line.

**Step 8, E-R** (`psas10-er.mjs`, output `psas10-er.out`; each S9 copy equals its S9 blob):
- **queue.mjs:** `CUSTODIAN-QUEUE.json` parsed, with plan_hash and generated_at dropped, is deep-equal. `CUSTODIAN-QUEUE.md` differs on line 3 only, the `Generated from` line. As predicted.
- **site.mjs, index.html:** equal with plan_hash and generated_at normalised (raw differs, as expected).
- **site.mjs, plan.json:** 312 nodes at both revisions in the same order. For the 100 moved nodes the summary is exactly `[archived summary] state/cut-archive/PLAN-SUMMARIES-2026-10-21.yaml` and every other field is equal. The other 212 nodes are deep-equal. lanes, phases and priorities_approved are equal. `findMetricViolations` gives 0 at S9 and 0 at S10.
- **buildHealth.mjs:** `scripts/plan/buildHealth.mjs` contains no `PLAN.yaml`, `loadPlan` or `plan.mjs` text, so it reads no PLAN.yaml. The file is unchanged S9..S10.
- **questions-mirror.mjs:** `buildSummary` on `state/questions/round-73.md` (file sha256 0fcca38c…e8136) is byte-identical to S9's. Both outputs are `Question round 73 — 5 items; full text attached (copy-paste ready)`, sha256 badb01be1506e79b3bccf1926e48a34911ed0c61aa0c847974ba50c34931a6c9, with empty stderr.
- The table matches as predicted, so I3 does not fire.

**Step 9, E-M (c) and the evidence:**
- `cat-file -s S9:PLAN.yaml` = 703836 and `S10:PLAN.yaml` = 412316. The difference is **291520**, equal to the script's moved bytes. PASS.
- Blob ids:
  - the archive: 56ba73a11869c682f177be816f7c4bc30511b1d1 (304,005 bytes);
  - PLAN.yaml at S9: 83abe8bbc6f9b8007b8694f90b83ac713d444fa1;
  - PLAN.yaml at S10: 841e0527f16aac1d770a035424ddd52c5526bc03.
- `git diff --no-renames --name-status S9 S10`:
  ```
  M	CUSTODIAN-QUEUE.json
  M	CUSTODIAN-QUEUE.md
  M	PLAN.yaml
  M	site/data/plan.json
  M	site/index.html
  A	state/cut-archive/PLAN-SUMMARIES-2026-10-21.yaml
  A	state/drafts/plan-summaries-d-obligations.md
  ```
- The archive's first three lines end `…Never edited.`, then `source: {path: PLAN.yaml, commit: "ab9a4b4f957aaf61dedd5e08446bf98fdca55d7f"}`, then `summaries:`.

**Differences from the brief:**
1. `origin/main` resolved to ab9a4b4f at S10, as noted under step 0, so P differs from S9's dry run.
2. The step 3 generators' stdout and stderr went to /dev/null, not to files.
3. I never saw an exit code printed for the CI-glob hold command.

No invalidator fires on these readings: I2 (D1-b differs beyond the named exception), I3 (E-R) and I4 (E-M (c)) all hold. Whether I6 is raised afresh by the changed P is for the custodian to judge.

**Final state:** `git status --porcelain` in `C:/dev/wt/psa` is empty. HEAD = origin/cut/plan-summaries-archive = 120cd55dadd68ab4670776f6882b3e028624edf2. The scratch folder holds the `psas10-*` files, including `psas10-commit-message.txt`, `psas10-script.stdout`, `psas10-er.out` and `psas10-verifymove.out`. I ran as Sonnet 5.5 (`claude-sonnet-5-5`), with no model override and no context handoff.
