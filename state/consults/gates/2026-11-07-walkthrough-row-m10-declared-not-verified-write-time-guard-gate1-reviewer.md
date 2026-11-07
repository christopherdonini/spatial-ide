*Custodian's filing note (2026-11-07): the reviewer's report for gate 1 of PR #293, from its hand-back (sha256 e8d7ade1582de1f37c016214a40dee3c94740a67e97134d441e7b7cdd00a0833, 15703 bytes), byte for byte except one span repeated: the path of the session scratch folder in its last paragraph (6 times), a user-profile path, replaced by `<the session scratch folder>/` under the human's rule that no filed record quotes a user-profile path. A report, not Authority.*

---

Reviewed: PR #293 at 2abc75cc503ed4af163e1706c050fe9a8040513f (base 0bd29263), gate 1, reviewer
Verdict: PASS WITH NOTES

The brief's sha256 matched (dec88265…cb5e7, 8107 bytes), and so did the packet's (fe750994…be1c, 6179 bytes). I read the gate-round rulings (Part 1, items 1 to 9), the form at the head, which matches main's sha256 6ccf6471…d79, settlement included, the worker report, which matches main's sha256 5ee34220…7f0, and the whole diff.

## Findings

**Correctness: none.** Every clause of the new span holds at 2abc75cc (table below).

**Evidence: none.** I re-ran all of section 4, items 1 to 7, myself, and every item passed.

**Documentation, must-fix before the merge. This is the worker's PR body, not the human's wording, so there is no re-gate.**
- D-1. The PR body's "Whose the old span was" bullet gives only the `git log -S` result. The settlement's OPEN-3 (a) says the worker "runs `git log -L` on the old span at the base and records the result in the PR body". The body never names `git log -L`, which I confirmed by script.
  - Replacement words: "**Whose the old span was (section 31):** `git log -L 884,884:frontends/shell/MANUAL-WALKTHROUGH.md` at the base 0bd29263 lists five commits, and only f8e2d43ab136bf3407587fd9a0333dd2336d3b92 changed the old span (it introduced it). That commit carries a Claude Fable 5.1 Co-Authored-By trailer, and `git log -S` on the full old span returns it alone. Those are an agent's words, not the human's typed words."
  - Clause check:
    - "five commits": my `-L` run lists 13df4cb5, f8e2d43a, d09e292f, 090f35c4 and 3275a1d4.
    - "only f8e2d43a changed the old span": my script found the span absent before f8e2d43a and present after it. 13df4cb5 had it on both sides, and the other three had it on neither.
    - "Claude Fable 5.1 trailer": `%(trailers:key=Co-Authored-By)` on that commit.
    - "`-S` returns it alone": my `git log -S` run at the base returned one commit.

**Cases the clauses do not cover, named for the source record and not blocking.** Both sit inside the `DeclaredNotVerified` route, which ordinary use cannot reach (clause 9).
- N-1. The partition ceiling fires first.
  - `kernel/src/publish/mod.rs:826-832 @ 2abc75cc sha256:d1bdfdfde903cc16f0823130f7c312e9b03e22fb7aa001f92ba5e54ec3b8670c` checks `MAX_PUBLISH_PARTITIONS` (100,000; `engine/src/stream.rs:171-174 @ 2abc75cc sha256:eed7437ab6b4ae17d7b31b40cc88f8e5dd622ae3a73d44bdf97d4e17e9c717cb`) before the `MAX_FEATURES` guard in the same iteration.
  - 2,000,000 rows over 100,000 partitions is 20 rows each. If partitions average fewer than that (rows over about 52 KiB, given the 1 MiB partition target), the refusal is `CeilingExceeded` for `MAX_PUBLISH_PARTITIONS`, not for `MAX_FEATURES`. The code is still `publish.ceiling_exceeded`.
- N-2. Staging cannot be removed.
  - If the staging directory cannot be removed, the refusal is `StagingNotRemoved` (`kernel/src/publish/mod.rs:663-677 @ 2abc75cc sha256:0654af856aab5fc5ad45c62ee444321a4fc220f9d95e4cb247e95160673ab78a`), code `publish.staging_not_removed`, with `CeilingExceeded` inside it.
  - "nothing left at the destination" still holds. The form's "What I could not settle" already names this case.

**For the custodian, not a defect of the piece.**
- C-1. Form Note 7 says "governance CI, must be green before the merge". Governance CI's `pull_request.paths` (`.github/workflows/governance-ci.yml`, the `on:` block) does not include `frontends/shell/MANUAL-WALKTHROUGH.md`, so it never runs on this PR and no CI run can meet that condition.
  - My run of its own invocation at the head is under check 6.

## Checks

**1. The diff against sections 2, 7 and 8.**
- `git diff --name-only 0bd29263...2abc75cc` exited 0 and lists only `frontends/shell/MANUAL-WALKTHROUGH.md`.
- `git log 0bd29263..2abc75cc` holds one commit, 2abc75cc. The merge base is 0bd29263.
- `--numstat` exited 0: `1 1 frontends/shell/MANUAL-WALKTHROUGH.md`. That is 2 lines in 1 file against the ceiling of 10 in 1, so there is no class 8 overrun.
- Line counts are 2005 = 2005.
- `## Result log` is at line 987, after the hunk (rule 2.0 (b)).
- Line 884 at the head has no CR and no tab. The file has no CR anywhere and ends in LF.
- Every other line equals the base. Line 884 equals the base outside the span (check 3).

**2. Section 4, items 1 to 6.** My own script, scratch `m10-g1r-ev.mjs`, written from the form's text, exited 0 with every line OK.
- Item 1: one hunk, `@@ -884 +884 @@`.
- Item 2: line 884 at the head, with the new span replaced by the old, equals the base. 0 other lines differ.
- Item 3: `check_streamed_features` and `publish.ceiling_exceeded` count 1 each at the head and 0 each at the base.
- Item 4: the absence pattern counts 0 at the head.
- Item 5: the positive self-test counts 1 at the base.
- Item 6: name-only lists only the one file.
- Cross-check with `git grep -c -F` and its exit codes:
  - At the head: rc=0, rc=0, and rc=1 for the absence pattern.
  - At the base: rc=1, rc=1, and rc=0 for the absence pattern, which is the positive self-test.

**3. Byte-equality.**
- The spans were taken by script from the quote lines after `**Old** (byte-copied from my Read of that line):` and `**New (mine):**`, which are form lines 60 and 63, with `> ` stripped.
- Line 884 at the head equals line 884 at the base with the old span replaced by the new. The reverse replacement also holds, and each span occurs exactly once.
- Old span: sha256 7aad01d3c28cbf1b81f07a3fa4eadb4e09770f650e4b82e3c0de1fb6e6659730 (93 bytes).
- New span: sha256 d0794c411f16ebc971622bbd505f1eda1c444eddd9813cbb1215e3057c64ec67 (547 bytes).
- Line 884 at the head with its LF: sha256 7f18bb898138d1cabd8ec4c7201b70905a14dd2f348d6c49f75333249815f99e.
- Line 884 at the base with its LF: sha256 7e76791af084b3e942241d7ac7e3aa88f1541536a07c8cfc2a35aaa74ec3f6b9, which equals the form's fbc905ec pin.

**4. The clause table at the head.** `git diff --name-only fbc905ec 2abc75cc -- kernel engine frontends/shell/src-tauri renderer protocol` is empty, so the code the form read has not moved.

| # | Clause | Code @ 2abc75cc | Holds |
|---|---|---|---|
| 1 | "its pin still runs" | `kernel/src/publish/ceilings.rs:172-177 @ 2abc75cc sha256:b212340abe4da6cf46ce052ac343989f6401c7706dfea70bd9c19dd3f8516464` (`None` rows give `None`); `kernel/src/publish/ceilings.rs:144 @ 2abc75cc sha256:f3bc525adc4e3c5768204d1540c6f2632f0136479cc13bd5af868c9ead239b72` (refuses only on `Some`); `kernel/src/publish/mod.rs:574-578 @ 2abc75cc sha256:070ea68fd3173b853de0d976dfe5eb401cde5561f17634ccf1ef792307d8cb69`; shell `frontends/shell/src-tauri/src/publish.rs:455-463 @ 2abc75cc sha256:d599a70c1dd0b79033a54bd851f726d53977da71701a13ab2c81e2d0ceb1d1a2`, then `frontends/shell/src-tauri/src/publish.rs:468-472 @ 2abc75cc sha256:8faefde8562a2eb908ca29001a250d9e786cdc5370ae11911d8ec6b976c08805` (pin). `preflight_pinless_parts` (mod.rs:473-548) refuses `DeclaredNotVerified` on no other ground. | yes |
| 2 | "the attempt can still reach the approval dialog" | `frontends/shell/src-tauri/src/publish.rs:411-415 @ 2abc75cc sha256:ac0e302fcc2ce2c62cdba1985d239d553e8c63ed10b6726162d2791e7f29ee02`; `prepare_with_query`'s `preflight` (publish.rs:581) makes the same `None` prediction | yes |
| 3 | "refused only once the publish runs" | Preflight cannot refuse (clause 1). The guard sits in `run_inner`, reached through `publish_prepared`/`run`: `kernel/src/publish/mod.rs:645-663 @ 2abc75cc sha256:7cdede6b5194a3b15f9021d28cfe5eabc41542a2be866dd89f5ea935664e8d5c` and `kernel/src/publish/mod.rs:696-705 @ 2abc75cc sha256:5c809fbef9faf3939922ee46aa5c72e42a914f4985f6f2e90ad3dbbd7dad847c`. Shell `execute_with_progress` → `boundary::execute` (publish.rs:863). | yes (N-1 named) |
| 4 | "by the write-time `MAX_FEATURES` check (`ceilings::check_streamed_features`, in the partition loop)" | `kernel/src/publish/ceilings.rs:187-201 @ 2abc75cc sha256:9f28779c83b88beb9197e26b7de97ce1159059edef090cbf2318a0debcb58458`; call `kernel/src/publish/mod.rs:833-837 @ 2abc75cc sha256:7cc4f5b085b3f6aaa91d1fa3b10468c24b189b912c85017ad73d760cfc40cdad` inside `loop` (mod.rs:779-851) | yes (N-1 named) |
| 5 | "as `publish.ceiling_exceeded` and not `publish.reader_ceiling_exceeded`" | `kernel/src/publish/ceilings.rs:194-198 @ 2abc75cc sha256:0e4f1b504b9d12a6da60820a151fea9b6d00a972ed06083ad7da66d7f34c95aa`; `kernel/src/publish/error.rs:298-299 @ 2abc75cc sha256:25687bf6e3bb951a457f6039a28fb33ef4e5c15b9ec400f7fd40b754b8937955`; `kernel/src/publish/error.rs:312-314 @ 2abc75cc sha256:12da66c02017f2779734221c19097cad39019e6850b71073cc64234d238d8832`; shell `frontends/shell/src-tauri/src/publish.rs:891-893 @ 2abc75cc sha256:c454880f228f7e1fd9295349b4ea646b7391bf02d24cc86613f6518b9fd70549` | yes (N-2 named) |
| 6 | "before the partition that would cross the ceiling is written" | `kernel/src/publish/ceilings.rs:192-193 @ 2abc75cc sha256:9b94c79be6c9645097256484290c5ff3f5f1d0c911d9a993b57fdf9b318f4e2b` (`saw > max`, the batch included); `write_partition` comes after the guard at `kernel/src/publish/mod.rs:839 @ 2abc75cc sha256:263a1aca99999c63cfcd2507c3ee39f5c1038fbc0956ae32a0a3137c63622c9c` | yes |
| 7 | "with nothing left at the destination" | `kernel/src/publish/mod.rs:656-661 @ 2abc75cc sha256:f9867c04aaba568552274ee4c6c9796ce1644fd515db40eafb96231cd2cdd03e`; staging beside it, `kernel/src/publish/mod.rs:1542 @ 2abc75cc sha256:ef7e7b642edfb4e7034a8a77f1a8d203c28b3db06b4596fde5850615335bf118`; removed on error, `kernel/src/publish/mod.rs:663-677 @ 2abc75cc sha256:0654af856aab5fc5ad45c62ee444321a4fc220f9d95e4cb247e95160673ab78a`; destination only by the rename in `kernel/src/publish/mod.rs:1703-1715 @ 2abc75cc sha256:5a335d835049facbea059190d5956bf886f9ea68d5453612ffee36ee008cd7cf`. The test `kernel/tests/publish_identity_tier.rs:516 @ 2abc75cc sha256:e675fbff9fe3fbe5f0f00e3a1621c4d23580ec784087327e814457089f2c69ca` asserts it (`#[ignore]`d, release). | yes |
| 8 | "no product route opens a dataset `DeclaredNotVerified` — the wire carries no skip-uniqueness field" | wire `protocol/skp/src/v0/commands.rs:58-60 @ 2abc75cc sha256:95a6882a72052191150b501b021a674f8d0a8dbf3e31f13d83948526433a1126` (`column` only); `kernel/src/skp.rs:1726-1738 @ 2abc75cc sha256:88f5ac7c52de30f59845270daae05b284050cadce53a129291e1bdcd9d9a40ce`; `engine/src/identity.rs:176-183 @ 2abc75cc sha256:48284f41156b69fb4ea2117abbe6c8d8d92dace624c79e9935dabf948f928eb4`; `kernel/src/publish/mod.rs:1495-1498 @ 2abc75cc sha256:b43840f25e24fd2ca7bdb7701b7de25a51d452270ac8dbb7eeb897e9dc93941e`. In `*.rs`, `git grep` (rc=0) finds `skip_uniqueness_check = true` only under `engine/tests/` and `kernel/tests/`. The struct literals in `kernel/src/dataset_ref.rs` (lines 212, 613 and 649) build the wire type. | yes |
| 9 | "so ordinary use does not reach this" | follows from clause 8 | yes |
| R | Unchanged clauses around the span ("has no predictable feature count either way"; the `NativeUnique` one) | `kernel/src/publish/mod.rs:412-414 @ 2abc75cc sha256:fbb6f1780eb9c17805416f2725a8490a60500c73939101226a4ebba43627981e`; `kernel/src/publish/ceilings.rs:119-121 @ 2abc75cc sha256:15ebe8f068e5186e578086e11cbcfa3c16401f2ea98576e53a44e83259a56d6a`; ceilings.rs:172-177 as above | yes |

No clause is untrue, so no replacement words are needed for the span. Two hashes match the form's fbc905ec pins: ceilings.rs:187-201 and mod.rs:833-837.

**5. Whose words (section 31).**
- `git log -L 884,884:frontends/shell/MANUAL-WALKTHROUGH.md 0bd29263` exited 0 and lists five commits. My classification script exited 0. The Co-Authored-By trailers have the email elided.

| Commit | Changed the old span? | Co-Authored-By |
|---|---|---|
| 13df4cb5 | no, present on both sides | Claude Sonnet 5.5 |
| f8e2d43ab136bf3407587fd9a0333dd2336d3b92 | **yes**, introduced it | Claude Fable 5.1 |
| d09e292f | no, absent | Claude Fable 5.1 |
| 090f35c4 | no, absent | Claude Fable 5.1 |
| 3275a1d4 | no, absent | Claude Fable 5.1 |

- `git log -S` on the full old span at the base exited 0 and returns f8e2d43a only.
- So the old span is an agent's words and not the human's, and §8 item 9 does not apply.
- `gh pr view 293 --json body` exited 0. The body records whose words they were (f8e2d43a, Fable trailer) and quotes the new span byte for byte, both checked by script. It records the `-S` result and not the `-L` result (D-1).

**6. Section 4 item 7 at the head, in `C:/dev/wt/m10`, with HEAD at 2abc75cc and the porcelain empty before.**
- `verify.mjs --offline` rc=0: PASS.
- `verify-cites.mjs` rc=0: PASS, 2723 files, 168 loose references advised.
- `verify-quotes.mjs`, in a shared hold, rc=0: PASS, 138 checked, 107 verified, 30 baselined, 0 hash-reference errors, 920 ruling cites resolved, 0 ruling-cite errors.
- `verify-test-claims.mjs` rc=0: PASS, 744 claims in 240 files.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, in a shared hold, rc=0: 598 tests, 598 pass, 0 fail.
- `gh pr checks 293` rc=0: all 8 checks pass. `gh run view` gives headSha 2abc75cc503ed4af163e1706c050fe9a8040513f and success for every run:
  - 42367981464 (pull_request, Product CI — shell)
  - 42367981441 (pull_request, DCO sign-off)
  - 42367981507 (pull_request, Exposure scan)
  - 42367981428 (pull_request, Ported notices)
  - 42367209564 (push, Ported notices)
  - 42367209645 (push, Product CI — shell)
- No governance CI run exists (C-1).
- Porcelain afterwards: empty (0 bytes), and HEAD is still 2abc75cc.

## For the human
- The new span is the architect's wording. Every clause holds against the code (check 4). N-1 and N-2 are cases outside ordinary use, named for the record.

## The packet's gaps
- It does not say governance CI's path filter excludes this file, so the form's Note 7 merge condition has no CI run to meet it.
- It does not say whether the code the form read at fbc905ec equals the head. I diffed it: no change.
- It gives no line 884 hash at the base to tie to the form's fbc905ec pin. I computed it: they match.
- It does not say the PR body records `-S` rather than the `-L` result the settlement asks for.

## Hold lines (this project's only, `also=` elided)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:54716 also=… (commands started from now on inherit it; release when done)`
- `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:54716 affinity=FF (cores 0-7)`
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:38188 also=… (commands started from now on inherit it; release when done)`
- `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:38188 affinity=FF (cores 0-7)`

## Background shells
- Both background tasks (bw85wl032 for verify-quotes, bs3knm6pu for the suite) completed with exit 0 and released their holds. None of mine is still running, and I killed nothing.

Scratch files are in <the session scratch folder>/, named m10-g1r-*. The main ones:
- <the session scratch folder>/m10-g1r-ev.mjs
- <the session scratch folder>/m10-g1r-ev-out.txt
- <the session scratch folder>/m10-g1r-who-out.txt
- <the session scratch folder>/m10-g1r-pins.txt
- <the session scratch folder>/m10-g1r-nodetest.txt
