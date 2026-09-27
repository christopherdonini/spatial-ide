*Custodian's filing note (2026-09-27): gate 3 (attempt 3), architect, full gating, for PLAN node `exposure-profile-paths`. Reviewed: governance/exposure-profile-paths @ 4155fcf21c784e64ad8daea06fbb819c1e79b426. Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). The text below the rule is the hand-back, byte-identical except for the harness's two-space indent, which is removed. Custodian's facts on its questions: at 18:17Z, 456 minutes had elapsed from round 28's ruling (the widest measure) and 309 from the form's first commit, against §10's 600; the local name contains no space (checked by boolean), so N-a arises here only for the flattened forms.*

---

governance/exposure-profile-paths @ 4155fcf: **Verdict: BLOCK** (architect, gate 3, attempt 3, PLAN node `exposure-profile-paths`). The block is on Documentation only, so it opens record round 1.

**How I read it.** I read the worktree `C:/dev/wt/exposure-profile-paths` as the tree at 4155fcf, and main at 254fbfa. I had no Bash, so every per-commit fact, byte fact, CI run and live run is the reviewer's to confirm. The form is cited by amendment and item. Branch-only code is cited by file basename, which is not a rooted path. There is no hash pin, and no profile-shaped string is reproduced here.

## §22 verdicts

### Correctness: PASS with notes
Severity low. Scope: `--redact` token choice. Disposition: route the note to `exposure-scan-followups`, or record it as a limit.

7.1(a) to (d) are met on reading:
- **(a)** `cUnquoteGitName` and its use: `profile-path-scan.mjs:103-135`, `:374-378`, `:537`. `-z` names are unchanged.
- **(b)** The containment filter: `:233-243`. It drops only a refused match inside another refused match, and the exact-span dedup stays.
- **(c)** `REFUSED_LINE` is at `:551`. Both hooks name a finding only on status 1 plus that line, and map status 1 without it to exit 2: `pre-commit:29-46` and `commit-msg:49-66`.
- **(d)** The reference now names the form's Amendment 4. It is in the verification bullet of Amendment 6 to the Custodian role in `AI_DEVELOPMENT.md`.

The hooks–scanner seam is read from the shipped side and proven end to end: real `git commit`, the shipped hooks and the shipped scanner.

**N-a (low).** Sometimes the match 7.1(b) keeps is a rule (iii) match. Its root starts at the `Users` word, not at the drive. `redactRoots` then emits the POSIX token and keeps the drive and separator, which is not the Windows token §7 declares. This happens in two cases:
- the flattened forms, since 4.1(f);
- after 7.1(b), a local name containing a character that ends 2c's segment run, such as a space.

`--redact-segment` is correct in both cases, and no byte of the name survives. 2g's agent-report rule uses `--redact`. The custodian can check by boolean whether the local name contains a space.

### Evidence: PASS with notes, conditional on the reviewer
If any of these fails, Evidence is FAIL:
1. governance-ci `36336589025` succeeded on ubuntu at 955e6c7, and governance-ci at 4155fcf is green (7.13 step 9 and the third added invalidator).
2. 7.13 step 1: Amendment 7 was committed before any code, and its sha256 equals the draft's. 4155fcf touches only the form.
3. The mutations of the 4 new tests and 2 changed tests of 7.3 fail by name at C′ `955e6c7`. The C′ to M′ diff is empty for the scanner, the test file and both hooks.
4. The re-derivation recomputed at 254fbfa and at f7a19e9 gives 30 and 22 files, with no file outside §2a's 20 plus the two routed ones.
5. An unfiltered `cargo test -p spatial-kernel` is green on the reviewer's run at 4155fcf, or Product CI's Rust-workspace job at 4155fcf is green. `git diff 254fbfa 4155fcf -- kernel/` is `normalize.rs` 1/1 only.

**E-a (low).** In `a_scanner_load_failure_is_not_named_a_finding`, the shipped-scanner half asserts `git commit`'s status. That is 1 for any hook refusal, so the 7.3 row's "exit 1" for that half is git's exit, not the hook's. The stub half, which the mutation targets, runs the hooks directly and asserts 2. Record it in one line, or route it.

### Documentation: FAIL
Severity medium. Scope: Amendments 8 and 9 only. Disposition: record round 1, one appended correction, then a scoped read. This is not a return to implementation review.

- **D1 — Amendment 8's first line lacks class 8's words (third time: A2-D5, R2-D4).** The words, verbatim from `docs/PREREGISTRATION-TEMPLATE.md` (Round 25 additions, class 8): `budget overrun, §7 not edited`. 7.10's first bullet committed to them. The round-25 by-name failure does not fire: the overrun is recorded as class 8, and the Budget line is untouched (the reviewer confirms the header bytes). The class form still fails.
- **D2 — Amendment 8's Reason is prose.** 7.10's third bullet orders a reason given by reference to 4.1, 4.3, 7.1 and 7.3 only. The append-target parenthetical also argues.
- **D3 — §8 item 10 fires.** Amendment 9's verify-quotes bullet re-carries, verbatim from the form (Amendment 9, suites bullet), "unrelated to and unmoved by". This is the clause R-D1 and A2-D1 named, and 7.12 says it is not re-carried. Also:
  - the Mutations bullet narrates the procedure again (A2-D1, second bullet);
  - the cargo disclosure's last sentence argues;
  - verify-cites' "pre-existing" is asserted with no proof.
- **D4 — 7.13 step 6 is unmet (third time: A-E4, A2-E3, R2-D1).** 7.8(b) promised the commands at M′.
  - The re-derivation command is described, not recorded verbatim.
  - The base run's output is counts only.
  - At M′, the 20 files are a reference to §2a, not path, form class and count.
  - Prediction 4's command still ends at `HEAD`. It resolves only through the lineage bullet, and 7.13 step 6 asks that both ends be named by id.
- **D5 — Round 7, an unresolvable discharge, by name.** This sentence, verbatim from the form (Amendment 9, last bullet), does not resolve: "4.1-4.13's items stay discharged as 7.9 and Amendment 3 already record them."
  - Amendment 3 predates Amendment 4, and 4.12 withdraws or supersedes it.
  - 7.9 holds 4.7 "open until M′".
  - 7.9 has no rows for 7.3 or 7.4, which the same bullet discharges "by reference to 7.9".
  - The correct map is: 4.7 to Amendment 9's M′ bullets; 4.9 to its prediction-4 bullet; 7.3 to 7.3's tables; 7.4 to the Mutations bullet at C′.
- **D6 (low).** The M′ bullet's "merge base `254fbfa` itself" reads as the parents' base. By 7.8(a)'s own reading that is 00cf306, and 254fbfa is the base of `origin/main...M′`. This is the two-base ambiguity 7.8(a) corrected.
- **D7 (low; the custodian's).** The ten "Observed:" corrections are claims that live in test comments. So class 3's named test-text exception (round 14) applies beside 7.4's class 4, and so does the tail of round 25, item 2 (d):
  - the PR body names the rows (lines of `profile-path-scan.test.mjs` at da80db0, words form, which is already met);
  - a PLAN node blocked on the piece carries the post-merge hash pins.
- **No action (record cap):** 7.5 is labelled class 2, although 4.1(e) is a declared value, not a §3/§5 prediction.

## Judge 1: Amendment 7, item by item
- **7.0:** sound.
- **7.1:** (a) to (d) met, with N-a.
- **7.2:** stands.
- **7.3:** all 4 new tests and 2 changed tests are present as declared, with E-a.
- **7.4:** 34 RECORDED MUTATION comments are present, and the sampled Observed clauses record the first failure. D7 applies. No `verify-mutation` run is called an observation.
- **7.5:** stands, with the no-action note on its class.
- **7.6 and 7.7:** routed. The `exposure-scan-followups` node on main names both.
- **7.8:** (a) is accepted. My A2-E2 was a misreading of which base; the run at 00cf306 is the three-dot base. (b) to (d) are each at most 3 sentences with no restatement, but (b)'s promise is unmet (D4).
- **7.9:** every row resolves: the tests exist; the two "Dated correction (2026-09-27, exposure-profile-paths piece)" sections exist; the `commit-msg:26-31` comment; the setup comment of `pre_commit_scans_added_lines_only`; the `dco-hook-merge-skip` node is on main. Amendment 9's use of 7.9 fails (D5).
- **7.10:** bullets 1 and 3 are unmet (D1, D2). Bullet 2 is met: 625 + 109 + 1094 + 2 = 1830, and 1830 − 1532 = 298. The reviewer recomputes the numstat.
- **7.11:** stands, class 1.
- **7.12:** breached (D3).
- **7.13:**
  - Steps 1 to 5 hold, subject to Evidence items 1 to 3.
  - Step 6 is incomplete (D4).
  - Step 7 is defective (D1, D2, D5).
  - Step 9 is pending.
  - No added invalidator fired.

## Judge 2: §8 block-on-sight
1. Pass on reading. The custodian's scan at 4155fcf found 0; the reviewer confirms three-dot.
2. The reviewer's check. Amendment 9's prefix bullet passes on record.
3. The reviewer's check.
4. Pass on reading. 7.1(a) closes R2-C1.
5. Pass: `profile-path-scan.mjs:22-23` is unchanged and holds exact names.
6. Pass: `commit-msg:13-24` is unchanged.
7. The reviewer confirms. No workflow file is in the set.
8. Pass on record: 34 of 34, with C′ named.
9. Pass. `kernel/tests/end_to_end.rs:399` is not a self-line and resolves on main. It is redundant beside the test name.
10. **FIRES** (D3).
11. Pass on record, 1/1. The reviewer recomputes.
12. Vacuous.
13. Pass: N = 6. Main at 254fbfa ends at Amendment 5.

**Round 25 checks.** Class 8 is recorded, but its first line is defective (D1). There is no class 9 work, no `verify-mutation` run called an observation, and no hash pin at a branch commit. The test-text spans are named with da80db0. The five-line rule does not apply.

## Judge 3: Amendments 8 and 9 under the record cap
Both fail as closing records (D1 to D5). Where they are only references, they resolve: C′, the run ids, M′, N, the 2a′ commands, the prefix method, and the suite counts.

## Judge 4: the kernel timing failure
- **It does not touch this piece's claims.** §1 and §5 claim nothing about the kernel. The piece's kernel diff is one doc-comment line (the reviewer confirms). The §4 normaliser tests are among the 280 passes. R2 ran the same suite green at da80db0.
- **How it should be recorded.** As a class-1 row with references only:
  - the named test;
  - the counts at M′;
  - the alone-run command and its result;
  - the green unfiltered run of record: the reviewer's gate-3 run, or the Product CI run id at 4155fcf.

  Drop the argument sentence and the file line.
- **Routing.** The custodian should file a proposed node for it. It is a docs/08 cancel-latency assertion that fails under CPU contention. A run under contention is not a docs/08 measurement, so no perf claim follows either way.

## Judge 5: may #133 be marked ready?
**No.** Order:
1. File the gate-3 reports on main.
2. The worker merges `origin/main` as M″. This is the final merge under 2g and 4.7, and it re-runs 7.13 step 6 with commands verbatim.
3. The worker appends:
   - **Amendment 10**, class 8. Its first line carries the class-8 words. Its figures are by reference to Amendment 8's figure bullets, its reason is "7.1, 7.3", and it supersedes Amendment 8's first line and Reason.
   - **Amendment 11**, record round 1 (classes 3 and 1). It holds D3 to D6 as corrections of at most three sentences each, M″'s results by reference, and a superseded index.
4. Push, then a green governance-ci.
5. A scoped read of 4155fcf..head.
6. Ready.

Filing the scoped-read reports on main before ready moves main again and fires 4.7's last bullet. Either file them after the merge, or take that bullet's class-1 row.

## Record-round count
**1.** This gate fails Documentation alone, which 7.13 names as the opener. One correction round remains before the architect reduces the record under the record cap.

## For the human
- **Minutes, §10's 2× stop.** The form declares 300 minutes. At gate 2 the custodian counted about 340 against 600. The custodian should state the elapsed minutes now. If the stop has fired, continue, narrow or drop is yours.
- **Weekly window (already queued in `exposure-scan-followups`).** Whether segments that name no person should be exempt: the punctuation-only segment (7.7) and the macOS shared folder. This changes round 29, item 1's matcher.

No ADR decision is missing.

Files:
- `C:/dev/wt/exposure-profile-paths/scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md`
- `C:/dev/wt/exposure-profile-paths/scripts/hooks/profile-path-scan.mjs`
- `C:/dev/wt/exposure-profile-paths/scripts/hooks/profile-path-scan.test.mjs`
- `C:/dev/wt/exposure-profile-paths/.githooks/pre-commit`
- `C:/dev/wt/exposure-profile-paths/.githooks/commit-msg`
- `C:/dev/wt/exposure-profile-paths/AI_DEVELOPMENT.md`
- `C:/dev/wt/exposure-profile-paths/docs/PREREGISTRATION-TEMPLATE.md`
- `C:/dev/spatial-ide/kernel/tests/end_to_end.rs`
- `C:/dev/spatial-ide/PLAN.yaml`
- `C:/dev/spatial-ide/state/consults/gates/2026-09-27-exposure-profile-paths-gate2-architect.md`
- `C:/dev/spatial-ide/state/consults/gates/2026-09-27-exposure-profile-paths-gate2-reviewer.md`
