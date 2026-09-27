*Custodian's filing note (2026-09-27): gate 2 (attempt 2), architect, full gating, for PLAN node `exposure-profile-paths`. Reviewed: governance/exposure-profile-paths @ da80db006bb2e601b517a816498373f200f0b880. Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). The text below the rule is the hand-back, byte-identical except for the harness's two-space indent, which is removed. Custodian's facts on its "For the human" item on minutes: §10's 2× stop has not fired (the form declares 300 minutes; about 340 minutes had elapsed from round 28's ruling at 10:41Z, the widest measure, against 600); the node is filed at merge, since verify.mjs refuses an in-progress node whose gate is not tracked on main and the form's 19-file set keeps PLAN.yaml off the branch.*

---

governance/exposure-profile-paths @ da80db0: **Verdict: BLOCK** (architect, gate 2, attempt 2, PLAN node `exposure-profile-paths`)

I read the worktree `C:/dev/wt/exposure-profile-paths` as the tree at da80db0 (local, unpushed) and main at cec34b8. I had no Bash, so every per-commit fact, byte fact and live run is the reviewer's to confirm. Cites into branch files are read at da80db0. The form is cited by section, amendment and item. No profile-naming string is reproduced here.

## §22 verdicts

**Correctness: PASS with notes.** Severity: low. Scope: the scanner's redact modes. Disposition: fix in the fix round, or record as a limit.

The code meets 4.1(a) to (g) on reading (item-by-item below). The hooks fail closed on the declared clean line: `.githooks/pre-commit:18-48` and `.githooks/commit-msg:38-68` against `CLEAN_LINE` (`profile-path-scan.mjs:476`). That seam is proven end to end by the real hooks and scanner and by the stub tests.

- **N1. Overlapping matches corrupt `--redact` and `--redact-segment`.** The 4.1(f) regex (`profile-path-scan.mjs:157-178`) matches the local name inside a longer segment when a non-alphanumeric character follows it: `.`, `-`, `_` or `~`.
  - The rooted match (`:111-130`) takes the whole segment. The dedup (`:182-186`) drops only exact-span duplicates, so both matches survive.
  - `redactSegments` (`:261-279`) and `redactRoots` (`:239-253`) then walk a cursor backwards. The result is an extra marker (count 2 for one segment) or a stray `$HOME` token, and bytes of the segment are kept.
  - No leak follows: the name itself is always replaced. What breaks is 2g's "every other byte is kept" for such input.
  - This comes from this round's 4.1(f). The fix is small: drop a match whose span lies inside an already-kept refused span, plus one test with a mutation (exact-span dedup only). Otherwise, record it as a limit under §1's "beyond what the tested transform proves".
- **N2.** 4.1(e) declares `#<n>` as "its argument index". For findings, `printFindings` (`:468-472`) uses the finding's position instead. The branch is unreachable anyway: no refused match has an empty segment. Record this, or align it.
- **N3 (sibling note).** `--diff-filter=ACMR` (`:373`, `:404`) leaves out `T`. A symlink that becomes a regular file is not scanned. The filter is the form's own 2c text, so this is not a deviation. It goes to the 4.7 follow-up node.

**Evidence: FAIL.** Severity: medium. Scope: one test, and Amendment 6's re-derivation and prediction-4 bullets. Disposition: a fix round under an appended Amendment 7, before any push.

- **E1. `the_local_profile_is_refused_even_when_listed` fails on governance-ci.** governance-ci runs on `ubuntu-latest` (`.github/workflows/governance-ci.yml:109`, `:127`).
  - The test sets HOME to a Windows-form path (`profile-path-scan.test.mjs:218`).
  - On POSIX, `os.homedir()` returns HOME, and `path.basename` does not split on a backslash. `localName` is therefore the whole string, the listed name is permitted, and the CLI exits 0 where the test asserts 1.
  - Its three siblings set HOME to a POSIX path (`:254`, `:357`, `:658`) and are unaffected.
  - Consequences: §5 prediction 3 holds only on win32, and the PR's CI would go red.
  - Fix: set HOME to the POSIX form of the same listed name. The test text changes, so 4.4's last bullet applies: re-observe the test's mutation at the fix commit.
  - Proof: a POSIX run (WSL, or governance-ci on the pushed branch), not a win32 run.
- **E2. The merge-base re-derivation was not run as labelled.**
  - Amendment 6's M bullet names merge base `16df0d7`. Its re-derivation bullet then runs "at the merge base" on `00cf306`, which is main's tip at M.
  - The count of 30 fits main's tip: the 20 of §2a, the 8 files this piece rewords, and the 2 files main added. So the run 4.7(ii) orders at the merge base is absent.
  - 4.13 step 7 (resolve each sentence, STOP on a mismatch) should have caught the contradiction.
- **E3. Commands not recorded: a repeat of A-E4 and R-D4.**
  - §0 item 1, 4.7(ii) and 4.13 step 6 require the re-derivation's one-line command. Amendment 6 describes it and does not give it.
  - 4.13 step 6 also requires the prediction-4 command, which is absent.
  - The prediction-4 range is written without `--first-parent`, which would include main's merged-in commits. The "8 commits" count implies first-parent, but the gate cannot tell.
  - The output for the 20 files is a reference to §2a, with no per-file form class and count (4.7(ii)).
- **E4 (note).** 4.9 orders messages scanned under `--message`, but Amendment 6 scanned them under `scanText`. The substance is equivalent apart from the canary, but it is an unrecorded deviation. The reviewer's re-run under `--message` settles it.
- **E5 (note).** `the_hooks_name_the_scanners_status` (`test.mjs:518-546`) drives only `pre-commit`. `commit-msg`'s per-status messages (4.1(c)) have no test, so a mutation that collapses them survives. Extend the test to both hooks in the fix round, keeping the one mutation.

**Documentation: FAIL.** Severity: medium. Scope: Amendments 5 and 6, and one reference in `AI_DEVELOPMENT.md`. Disposition: the same fix round. This is not the Documentation-only path.

- **D1. §8 item 10 fires again: Amendment 6 restates.**
  - The verify-quotes clause "unrelated to and unmoved by" repeats word for word the restatement R-D1 named at gate 1.
  - The Mutations bullet narrates the procedure.
  - The 4.8(b)/(c) bullet re-describes the disposition.
  - The Disclosure bullet argues in prose.
- **D2. Amendment 6's Disclosure is false.** It says 2g's final-merge rule does not apply because the piece "files no PR". That contradicts 4.7 (the final merge immediately before ready), 4.8(c) (the PR body; a merge, never a squash) and 2g's rule for N. The piece lands by PR. Withdraw the sentence as class 1 (round 15 (g)).
- **D3. Round 10, a quote that is not byte-exact.** The same bullet puts 4.7's last bullet in quotation marks, attributed as 4.7's own clause, with its initial capital changed. It also puts 2g in quotation marks with `...` eliding the qualifier "immediately" (round 11). Replace both with a section reference.
- **D4. Round 7, a discharge with no resolvable proof.** "Discharged: 4.1(a)–(k)" names files and C, not the tests or lines. The mapping exists (4.3's table) but is not named. Add a one-line map: 4.1(a) to the scissors test, (b) to the space/link test, (c) to the two fails-closed tests and the status test, and so on.
- **D5. Amendment 5's first line does not carry the words class 8 requires.** Those words are, verbatim from `docs/PREREGISTRATION-TEMPLATE.md` (Round 25 additions, class 8): `budget overrun, §7 not edited`.
  - The overrun is recorded as class 8, and the Budget line is untouched, so the round-25 by-name failure does not fire.
  - The class's form still does not hold. Correct it with one appended line.
  - Its Reason paragraph is prose where 4.1 and 4.3 references would carry it. "re-observations grew the total" is inaccurate: the RECORDED MUTATION comments did.
- **D6 (low).** `AI_DEVELOPMENT.md:742` @ da80db0 ends with a bare "(4.1(k))", which cannot be resolved from that file. Name the form, or drop it. This is the piece's own unmerged appended text, so it may be edited in place.

## Amendment 4, item by item

- 4.0: sound.
- 4.1:
  - (a) met: `profile-path-scan.mjs:420-434`; `findScissorsIndex` and `marker` gone.
  - (b) met: `:523-548`.
  - (c) met in both hooks; E5 applies.
  - (d) met: `:293-344`.
  - (e) met, with N2.
  - (f) met, with N1.
  - (g) met: `:88-94`, `:131-151`.
  - (h) met: both corrections now state the ruling's corrected result (`PUBLIC-AUDIENCE-AUDIT.md:275-284`, `PRE-PUBLIC-CHECKLIST.md:437-445` @ da80db0).
  - (i) met: `.githooks/commit-msg:26-31`; the DCO block is untouched.
  - (j) met: no "wait" remains; the setup comment states its purpose.
  - (k) met, with D6.
- 4.2: stands.
- 4.3: all 9 new tests and the 3 changed tests are present under their declared names. E1 and E5 apply.
- 4.4: the comments state the mutation and the observed failure, and C is named in Amendment 6. Re-observation is the worker's claim, which the reviewer samples. E1's fix triggers the last bullet.
- 4.5: stands. Its follow-up node is on main (PLAN.yaml, the DCO merge-skip node, proposed).
- 4.6: the arithmetic is consistent (548 + 105 + 877 + 2 = 1532; 1532 − 1056 = 476). The reviewer recomputes the numstat at 8f7698e. D5 applies.
- 4.7: N = 6 holds at cec34b8 (main's last heading is Amendment 5). The two hits in files main added are listed and routed. E2, E3 and D2 apply. The follow-up node is not yet filed (the custodian's).
- 4.8: stands.
- 4.9: E3 and E4 apply.
- 4.10 to 4.12: stand.
- 4.13:
  - The order holds if 34f62c5 touches only the form (the reviewer's check).
  - Step 6 is incomplete (E3).
  - Step 7 failed (E2, D2).
  - Neither added invalidator fired.
- Superseded index: adequate. 4.1(c), (e), (f) and (g) refine 2c, 2d and 2e without contradicting them.

## §8 block-on-sight, items 1 to 13

1. Pass on reading: none in the scanner, the tests, the hooks, Amendments 4 to 6, the 2f corrections or the 2g text. The byte check is the reviewer's, three-dot.
2. The reviewer's check. On reading, main's `AI_DEVELOPMENT.md` ends at Amendment 5, and the branch's text follows it.
3. The reviewer recomputes, at the final merge.
4. Pass on reading: every printed path goes through `safePrintablePath` (`:442-472`). N2 is a note.
5. Pass: `:22-23`, exact names.
6. Pass on reading: `commit-msg:13-24` is unchanged. The reviewer confirms live.
7. The reviewer confirms; no workflow is in the file set.
8. Pass on record: 30 of 30 comments are present, and C is named. The reviewer re-observes a sample.
9. Pass.
10. **FIRES** (D1).
11. Pass on reading. The reviewer recomputes at the final merge.
12. Vacuous.
13. Pass: N = 6 by 2g's rule at M. It is re-read at the final merge.

Round 25 checks:
- Class 8 is recorded, but its form is defective (D5).
- No class-9 work.
- No `verify-mutation` run is called an observation.
- No hash pin at a branch commit.
- The five-line rule does not apply.

Rulings against §2:
- Round 28, item 1: met as narrowed by 4.2, subject to E1.
- Round 28, item 2: met.
- Round 29, items 1 to 5: met. 4.1(f) and 4.1(g) implement 2c's letter; they do not change the adopted matcher.
- Round 30, item 1: the pin now holds on the shipped CLI on both platforms.

## Judge item 4: the regex-segment false positive

It is a limit to record, not a defect of 2c for this piece to fix.
- The scanner applies 2c as written. A segment runs to a separator (`:28`), only the listed permits pass, and a punctuation-only segment is refused.
- Round 29, item 1 adopted that matcher, and Amendment 2 and 4.10 hold it unchanged. Narrowing the segment grammar (for example, a segment must begin with a name character) is a matcher change, so it is the human's call.
- It fails closed, and only on added lines. But 2g's "Refusals" route (list the name) cannot absorb a metacharacter. An author, the corpus branch included, who re-adds such a pattern must write it without the root sitting next to the metacharacter.
- Record it in one sentence in Amendment 7. Route it to the 4.7 follow-up node, and queue it for the weekly window with gate 1's macOS shared-folder item. Both are the same "a segment that is not a person" class.

## Judge item 5: the final merge, and before the push

**Order:**
1. Amendment 7 is committed before code.
2. The fix commit C′: E1, E5, and N1 or its limit.
3. The changed tests' mutations are re-observed at C′, and C′ is named.
4. Push (the custodian's call). A green governance-ci on the branch is the POSIX proof for E1.
5. Draft PR. The body carries 4.8(c) (merge, never squash; the 41d0341 blob enters history).
6. The final merge M′ of `origin/main` (cec34b8 or later), immediately before ready.

**Re-runs at M′:**
- N by 2g's rule.
- 2a′'s three checks, three-dot.
- §3's append-prefix check for the five targets (§8 item 2; 4.7 omits it, and §3 requires it at merge).
- The re-derivation at the true merge base and at M′: command verbatim, output as path, class and count. Any hit in a file main added after 16df0d7 (cec34b8's B1 gate reports are candidates) is listed and routed under 4.7.
- The node suites, unfiltered `cargo test -p spatial-kernel`, verify-cites, verify-quotes and verify-test-claims, each named with M′.
- Prediction 4 over `--first-parent` ccdccfd to M′, messages under `--message`, command verbatim.
- 4.4's re-observation if the scanner, the test file or a hook differs from C′.
- One class-1 row per 4.7's last bullet, references only.

**Also before the push:**
- The custodian runs the redaction on the worker's hand-back before filing it. Its disclosed raw-diff output shows the channel.
- The reviewer's 2a′ recompute runs behind a redacting filter.
- The 4.7 follow-up node is filed.

**Amendment 7 skeleton** (class 1, post-gate-2, declared before code; references only):
- 7.1 E1 test fix, class 4 re-observation.
- 7.2 E5.
- 7.3 N1: fix with test and mutation, or limit.
- 7.4 corrections, each at most 3 sentences with no restatement: E2, E3, E4, D4's map, D5's words.
- 7.5 withdrawal of D2's sentence (class 1).
- 7.6 the item-4 limit.
- Superseded index.

## Record-round count

**0.** 4.13's rule applies: this gate fails Evidence on a test-code defect, not on Documentation alone. D1, D4 and E3 repeat gate-1 findings. If gate 3 fails on Documentation alone, that opens record round 1.

## For the human

- **The PLAN node is missing.** No `exposure-profile-paths` node exists in `PLAN.yaml` on main at cec34b8 or on the branch, although round 28, item 2's Applied line names it. §10's 2× `budget_minutes` stop therefore has nothing to read against. The form declares 300 minutes, and the piece has likely passed 600. The custodian should add the node and apply §10: record the overrun and put continue / narrow / drop to you.
- **Weekly window:** whether segments that name no person (the macOS shared folder; a punctuation-only segment) should be exempt. This changes the round 29, item 1 matcher.

No ADR decision is missing.

Files:
- `C:/dev/wt/exposure-profile-paths/scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md`
- `C:/dev/wt/exposure-profile-paths/scripts/hooks/profile-path-scan.mjs`
- `C:/dev/wt/exposure-profile-paths/scripts/hooks/profile-path-scan.test.mjs`
- `C:/dev/wt/exposure-profile-paths/.githooks/pre-commit`
- `C:/dev/wt/exposure-profile-paths/.githooks/commit-msg`
- `C:/dev/wt/exposure-profile-paths/AI_DEVELOPMENT.md`
- `C:/dev/wt/exposure-profile-paths/PUBLIC-AUDIENCE-AUDIT.md`
- `C:/dev/wt/exposure-profile-paths/PRE-PUBLIC-CHECKLIST.md`
- `C:/dev/wt/exposure-profile-paths/.github/workflows/governance-ci.yml`
- `C:/dev/wt/exposure-profile-paths/docs/PREREGISTRATION-TEMPLATE.md`
- `C:/dev/spatial-ide/state/consults/gates/2026-09-27-exposure-profile-paths-gate1-architect.md`
- `C:/dev/spatial-ide/state/consults/gates/2026-09-27-exposure-profile-paths-gate1-reviewer.md`
- `C:/dev/spatial-ide/PLAN.yaml`
- `C:/dev/spatial-ide/engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`
