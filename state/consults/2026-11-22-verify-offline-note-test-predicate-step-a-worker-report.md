*The step-A worker's report for the second piece of the node verify-offline-note-test-flake (the five-line form `governance/forms/scripts/VERIFY-OFFLINE-NOTE-TEST-PREDICATE-PREREGISTRATION.md`), a read in C:/dev/wt/vonp at 533c7402275086651c1fd590cd2005eb21cb9dc5 that changed no file. Filed by the custodian below the rule from its hand-back in its transcript, 5717 bytes, sha256 803be7fae1173283f8e5b491617fc638bfeb3c13224fde5aaccdb85e2463a088, byte for byte but for one mask: the scratch folder's path is written as <S> (1 place). Its run: Read 1, Bash 8, SubagentHandback 1, by unique call ids, no call errored, model claude-sonnet-5-5, from 2026-11-22T14:09:53Z to 2026-11-22T14:10:47Z by its transcript; no call named the main checkout; no compaction.*

---

Read: the offline-note test's evidence-failure text at 533c7402275086651c1fd590cd2005eb21cb9dc5
Result: a fixed text tells such a failure apart: `PR #<digits>`, `evidence {pr: <digits>}` and `(gh release view)`, each found in verify.mjs only among failure strings. I changed no file and made no commit.

Start state: HEAD was 533c7402…, `git status --porcelain` was empty. I read the form whole.

1. The test (lines are from `git show 533c7402:scripts/plan/verify.test.mjs`):
```
267:test('runVerify: --offline note is present and PR/release evidence does not fail solely for being unchecked', () => {
268:  const dir = makeTempDir('verify-offline-note-');
269:  const planPath = path.join(dir, 'PLAN.yaml');
270:  fs.copyFileSync(path.join(fixturesDir, 'valid-plan.yaml'), planPath); // has {pr: 1} and {pr: 2} done evidence
271:  const result = runVerify({ planPath, repoRoot, siteDir: path.join(dir, 'site'), offline: true });
272:  assert.ok(result.notes.some((n) => n.includes('--offline')), `notes runVerify returned: ${JSON.stringify(result.notes)}`);
273:  assert.ok(!result.failures.some((f) => f.includes('pr')), `failures containing pr: ${JSON.stringify(result.failures.filter((f) => f.includes('pr')))}`);
274:});
```
The fixture is `scripts/plan/fixtures/valid-plan.yaml`. Its PR evidence is `evidence: {pr: 1}` at line 23 and `evidence: {pr: 2}` at line 40. It holds no release evidence (grep for `release:` found nothing).

2. Places that write a PR or release evidence failure. All are in `scripts/plan/verify.mjs` at 533c7402, quoted from `git show`. Fixed text is what is not a `${…}` fill-in.
- 180: `    if (!slug) return [`${tag}: evidence {pr: ${evidence.pr}} could not be checked (no repo slug found)`];`
  - Fixed text: `evidence {pr: ` … `} could not be checked (no repo slug found)`. This is the online path with no slug. It is not reached offline, because line 179 returns `[]` when `offline` is set.
- 182: `    return result.ok ? [] : [`${tag}: PR #${evidence.pr} is not merged (${result.detail})`];`
  - Fixed text: `PR #` … ` is not merged (`. This is the online merged-state check.
- 195: `      : [`${tag}: release "${evidence.release}" was not found (gh release view)`];`
  - Fixed text: `release "` … `" was not found (gh release view)`. This is the online release not-found. Line 193 returns `[]` offline.
- 236: `  return [`node "${node.id}": status is "${node.status}" but PR #${pr} is reported merged (${result.detail})`];`
  - Fixed text: `but PR #` … ` is reported merged (`. This is the check in `verifyNotDoneEvidenceNotMerged`. It needs `prResults`, which is empty offline.
- Offline, evidence lines 179 and 193 return `[]`. So no PR or release evidence failure is written at all.
- No other place pushes such a text into `failures`. The other `failures.push` sites in `runVerify` and `verifyStatusAgreement` are the status-agreement, gate, felt_verdict, queue-drift and site-drift strings. A `loadPlan` error returns `[e.message]` at line 302. plan.mjs:164 reads `…nor a PR ({pr: N})`, which has no `#` and no digit after `{pr: `.

3. The distinguishing text is `PR #<digits>`, `evidence {pr: <digits>}` and `(gh release view)`. The search, run from the worktree, was:
`git grep -n -E 'PR #|\{pr: |\(gh release view\)' 533c7402… -- 'scripts/plan/*.mjs' ':!scripts/plan/*.test.mjs'`, rc=0. The output:
- plan.mjs:155 is a comment.
- plan.mjs:164 is `({pr: N})`, which is not a digit form.
- queue.mjs:31 is `PR #${evidence.pr}`, a rendering of the queue.
- site.mjs:91 is `…PR #${evidence.pr}</a>`, a rendering of the site.
- verify.mjs:180, 182, 195 and 236 are the four failure strings above.

queue.mjs:31 and site.mjs:91 are render strings, not failures. The drift problems I read (queue.mjs:241-254, site.mjs:866-889) are paths only. verify.mjs:15 is a comment that also matched the search. It matched the `gh release view` form, not the `(gh release view)` form.

A second count, `git grep -c -E 'PR #\$\{|\{pr: \$\{|\(gh release view\)'` on verify.mjs, gives 4, which is the four lines above.

PR 354's gate report (`state/consults/gates/2026-11-22-verify-offline-note-test-message-gate-reviewer.md`, lines 39-42) names five failures. Its quoted message shows two `queue drift: …\verify-offline-note-pr-7n5cdC\CUSTODIAN-QUEUE.md does not exist` and `….json does not exist`, then `site drift: …` where the quote is cut at 300 characters. It says the failures contain `pr` only through the folder path and none is about PR evidence. Those are queue-drift and site-drift texts ("does not exist", "differs from a fresh generation"). They hold none of `PR #<digits>`, `evidence {pr: <digits>}` or `(gh release view)`. A folder path has no `#`.

4. Proposal only, nothing written to the test file:
`assert.ok(!result.failures.some((f) => /PR #\d|evidence \{pr: \d|\(gh release view\)/.test(f)), `PR/release evidence failures: ${JSON.stringify(result.failures.filter((f) => /PR #\d|evidence \{pr: \d|\(gh release view\)/.test(f)))}`);`
- The message prints, as JSON, the failures the predicate matches.
- A named constant above the test would avoid the repeated regex, but the form's budget is ≤16 changed lines.

5. Baseline: `node --test scripts/plan/verify.test.mjs > <S>/vonp-a-base.log 2>&1; echo rc=$?` printed rc=0. Totals: tests 24, pass 24, fail 0, cancelled 0, skipped 0, todo 0. The log is `<S>/vonp-a-base.log`. A scratch copy of verify.mjs is at `…/scratchpad/vonp-a-verify.mjs`.

State: the worktree is untouched and no background process is left. I made no Guardian or harness refusal.

Model: Sonnet 5.5 (claude-sonnet-5-5).
